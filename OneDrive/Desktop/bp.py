import socket

def handle_client(client_socket):
    subnets = {
        16: {"network": "23.36.81.0/28", "start": 1, "end": 14},
        64: {"network": "23.36.81.16/26", "start": 17, "end": 78},
        128: {"network": "23.36.81.80/25", "start": 81, "end": 206},
    }
    
    request = client_socket.recv(1024).decode()
    print(f"Received request for {request} addresses")
    
    try:
        request_size = int(request)
        if request_size in subnets:
            subnet = subnets[request_size]
            response = f"Allocated IPs: 23.36.81.{subnet['start']} to 23.36.81.{subnet['end']} from Subnet ({subnet['network']})"
        else:
            response = "Invalid request. Available options: 16, 64, 128. Please try again with a valid request size."
    except ValueError:
        response = "Invalid input. Please enter a valid number."
    
    client_socket.send(response.encode())
    client_socket.close()

def server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("0.0.0.0", 9999))
    server_socket.listen(5)
    print("Server listening on port 9999...")
    
    while True:
        client_socket, addr = server_socket.accept()
        print(f"Accepted connection from {addr}")
        handle_client(client_socket)

if __name__ == "__main__":
    server()