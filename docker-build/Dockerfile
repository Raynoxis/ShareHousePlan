#Firstly, we define the base image on top of which our application will run, Node in this case.
FROM node:18-alpine

#Then we define the WORKDIR; which is the working directory of the docker container at any given time.
WORKDIR /app

#Then we copy our package.json file from our local system to the docker image.
COPY ./docker-build/package.json .

#Then we run npm install inside the docker image to install all our dependencies.
RUN npm install

#Then we copy the rest of the files into the docker image.
COPY ./web .

#Finally, we ran npm run build to create a production build of our application.
RUN npm run build

#The step where we define EXPOSE 8080 is a convention and a good practice that declares on which port the application “should” run and not must run. We can have a different port exposed in the Dockerfile and can use a totally different port while running the image.
EXPOSE 8080

#The last command npm run preview runs only when the container spins up. It is not part of the Image creation process.
CMD ["npm","run","dev"]
