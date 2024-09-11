FROM openjdk:22-jdk
WORKDIR /app
COPY ./FlightSearch/build/libs/FlightSearch-0.0.1-SNAPSHOT.jar /app/FlightSearch.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/FlightSearch.jar"]