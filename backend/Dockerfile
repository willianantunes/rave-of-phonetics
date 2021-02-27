FROM python:3.9.2-buster

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    espeak-ng && \
    apt-get clean

WORKDIR /app

COPY Pipfile Pipfile.lock ./

RUN pip install --no-cache-dir --upgrade pip pipenv

RUN pipenv install --system --deploy --ignore-pipfile && \
    pip uninstall --yes pipenv

COPY . ./

RUN rm Pipfile Pipfile.lock

HEALTHCHECK CMD python healthcheck.py

CMD [ "./scripts/start-production.sh" ]
