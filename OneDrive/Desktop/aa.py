import socket
import ipaddress
def get_subnet_details(network: str):
    net = ipaddress.IPv4Network(network)
    details = f"""
    Network: {net.network_address}/{net.prefixlen}
    Total IP addresses: {net.num_addresses}
    Network address: {net.network_address}
    Broadcast address: {net.broadcast_address}
    Usable IP range: {list(net.hosts())[0]} - {list(net.hosts())[-1]}
    """
    return details
def allocate_ips(num_ips):
   
    main_network = ipaddress.IPv4Network('23.36.81.0/24')
    
    if num_ips <= 10:
        subnet = next(main_network.subnets(new_prefix=28))  
    elif num_ips <= 60:
        subnet = next(main_network.subnets(new_prefix=26))  
    elif num_ips <= 120:
        subnet = next(main_network.subnets(new_prefix=25))  
    else:
        return "Requested IP range exceeds available subnet options."
    usable_ips = list(subnet.hosts())
    allocated_ips = f"Allocated IPs: {usable_ips[0]} to {usable_ips[num_ips-1]}"
    
    subnet_details = f"From Subnet: {subnet.network_address}/{subnet.prefixlen}\n"
    subnet_details += allocated_ips
    return subnet_details
host = '0.0.0.0'  
port = 12345      
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((host, port))
server_socket.listen(5)
print(f"Server listening on {host}:{port}...")
client_socket, client_address = server_socket.accept()
print(f"Connection established with {client_address}")
client_request = client_socket.recv(1024).decode()
num_ips = int(client_request)
subnet_details = allocate_ips(num_ips)
client_socket.send(subnet_details.encode())
client_socket.close()
server_socket.close()