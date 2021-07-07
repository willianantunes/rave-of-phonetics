FROM python:3.9.6-buster

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    espeak-ng && \
    apt-get clean

WORKDIR /home/appuser

COPY Pipfile Pipfile.lock ./

RUN pip install --no-cache-dir --upgrade pip pipenv

RUN pipenv install --system --deploy --ignore-pipfile && \
    pip uninstall --yes pipenv

COPY . ./

RUN rm Pipfile Pipfile.lock

HEALTHCHECK CMD python healthcheck.py

RUN useradd --user-group --system --uid 1000 appuser \
    && chown -R appuser /home/appuser

USER appuser

CMD [ "./scripts/start-production.sh" ]
