import sys
import os


project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
print(project_root)


sys.path.insert(0, project_root)

from app.core.model.message import HybridMessage, TextMessage
from app.core.sdk.agentic_service import AgenticService


def main():
    """Main function."""
    mas = AgenticService.load("D:/02-dev/01-github/chat2graph/app/core/sdk/chat2graph.yml")

    # set the user message
    user_message = TextMessage(payload="Please introduce TuGraph of Ant Group.")

    # submit the job
    service_message = mas.session().submit(user_message).wait()

    # print the result
    if isinstance(service_message, TextMessage):
        print(f"Service Result:\n{service_message.get_payload()}")
    elif isinstance(service_message, HybridMessage):
        text_message = service_message.get_instruction_message()
        print(f"Service Result:\n{text_message.get_payload()}")


if __name__ == "__main__":
    main()
