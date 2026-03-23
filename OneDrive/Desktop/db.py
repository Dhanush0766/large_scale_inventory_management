import socket

def draw_pyramid(n):
    for i in range(1, n + 1):
        spaces = ' ' * (n - i)
        stars = '*' * (2 * i - 1)
        print(spaces + stars + '\n')

def main():
    host = 'localhost'
    port = 5000

    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(1)

    print("Server is running and waiting for client connection!!!")
    conn, addr = server_socket.accept()
    print(f"Client connected from {addr}!!!")

    number = int.from_bytes(conn.recv(4), 'big')  # Receive 4-byte integer
    draw_pyramid(number)

    conn.close()
    server_socket.close()
    print("Server is closed!!!")

if __name__ == "__main__":
    main()
