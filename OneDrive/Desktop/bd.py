import socket

def main():
    host = 'localhost'
    port = 5000

    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((host, port))
    print("Connected to the server!!!")

    num = int(input("Enter Number: "))
    client_socket.send(num.to_bytes(4, 'big'))  # Send 4-byte integer

    client_socket.close()
    print("Client closed!!!")

if __name__ == "__main__":
    main()
