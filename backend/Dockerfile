FROM node:14-alpine AS parcel-build

WORKDIR /built-project
COPY package.json package-lock.json ./
RUN npm install

COPY rave_of_phonetics ./rave_of_phonetics

RUN npm run build && npm run clean-css

FROM willianantunes/phonemizer:latest AS main

WORKDIR /app

# This way when I run collectstatic command it will collect all the static files the application needs
COPY --from=parcel-build /built-project/rave_of_phonetics/apps/core/static/core/dist/ ./rave_of_phonetics/apps/core/static/core/dist/

COPY Pipfile Pipfile.lock ./

RUN pip3 install --no-cache-dir --upgrade pip pipenv

RUN pipenv install --system --deploy --ignore-pipfile && \
    pip3 uninstall --yes pipenv

COPY . ./

RUN rm Pipfile Pipfile.lock package.json package-lock.json

CMD [ "./scripts/start-production.sh" ]
