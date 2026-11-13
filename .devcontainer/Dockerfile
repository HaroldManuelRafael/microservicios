FROM mcr.microsoft.com/devcontainers/typescript-node:24-bookworm

USER root

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
        curl \
        postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER node