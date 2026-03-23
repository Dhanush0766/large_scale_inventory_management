import socket
server_ip = '127.0.0.1'  
server_port = 12345      
client_socket = socket.socket(socket.AF_INET ,socket.SOCK_STREAM)
client_socket.connect((server_ip,server_port))
num_ips = input("Enter the number of IPs needed: ")
client_socket.send(num_ips.encode())
subnet_details = client_socket.recv(1024).decode()
print(f"Received from server:\n{subnet_details}")
client_socket.close()