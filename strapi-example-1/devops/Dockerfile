FROM node:14


ARG CI_COMMIT_SHA
ENV GITLAB_SHA=$CI_COMMIT_SHA
ENV UPLOAD_PROVIDER=aws-s3

COPY . /app
WORKDIR /app
RUN apt-get update && apt-get install -y bash default-mysql-client awscli
RUN yarn install --frozen-lockfile --silent && yarn build

EXPOSE 1337

ENTRYPOINT ["/bin/bash", "-c"]

CMD ["scripts/start.sh"]
