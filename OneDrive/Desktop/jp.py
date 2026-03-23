import socket

def client(request_size):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(("127.0.0.1", 9999))
    client_socket.send(str(request_size).encode())
    response = client_socket.recv(1024).decode()
    print(response)
    client_socket.close()

if __name__ == "__main__":
    client(16)
    client(64)
    client(128)
    client(32) 
