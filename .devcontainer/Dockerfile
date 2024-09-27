FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

WORKDIR /workspace
RUN chown -R 1000:1000 /workspace

RUN npm i -G @nestjs/cli

RUN sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d
RUN mv ./bin/task /usr/local/bin/task
