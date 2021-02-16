FROM willianantunes/phonemizer:latest

WORKDIR /app

COPY Pipfile Pipfile.lock ./

RUN pip3 install --no-cache-dir --upgrade pip pipenv

RUN pipenv install --system --deploy --ignore-pipfile && \
    pip3 uninstall --yes pipenv

COPY . ./

RUN rm Pipfile Pipfile.lock

HEALTHCHECK CMD python healthcheck.py

CMD [ "./scripts/start-production.sh" ]
