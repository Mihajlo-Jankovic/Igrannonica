import logging
from multiprocessing import connection
import sys
from pyparsing import null_debug_action
from signalrcore.hub_connection_builder import HubConnectionBuilder
import json


def input_with_default(input_text, default_value):
    value = input(input_text.format(default_value))
    return default_value if value is None or value.strip() == "" else value


server_url = input_with_default('Enter your server url(default: {0}): ', "wss://localhost:7219/chatHub")
username = input_with_default('Enter your username (default: {0}): ', "mandrewcito")
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
hub_connection = HubConnectionBuilder()\
    .with_url(server_url, options={"verify_ssl": False}) \
    .configure_logging(logging.DEBUG, socket_trace=True, handler=handler) \
    .build()

hub_connection.on_open(lambda: print("connection opened and handshake received ready to send messages"))
hub_connection.on_close(lambda: print("connection closed"))

def setFrom(input):
    global From
    From = input[0]
    print("my id is: " + From)

hub_connection.on("ReceiveConnID", setFrom)
hub_connection.start()
message = None

# Do login

To = None

Message = None


while Message != "exit()":
    Message = input(">> ")
    if Message is not None and Message != "" and Message != "exit()":
        hub_connection.send("SendMessageAsync", [json.dumps({'From': From, 'To': '', 'Message' : Message})])

hub_connection.stop()

sys.exit(0)