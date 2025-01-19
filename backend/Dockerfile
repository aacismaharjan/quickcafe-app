# Use Maven with OpenJDK 17 as the base image
FROM maven:3.8-openjdk-17

# Set the working directory
WORKDIR /app

# Copy only the pom.xml first (to cache dependencies)
COPY pom.xml .

# Pre-download dependencies (cache this layer to avoid re-downloading)
RUN mvn dependency:go-offline -B

# Copy the rest of the project files
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Run the Spring Boot app using Maven
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.profiles=dev", \
     "-Dspring.devtools.restart.enabled=true", \
     "-Dspring.devtools.livereload.enabled=true"]
