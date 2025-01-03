# Step 1: Build the app using Maven
FROM maven:3.8-openjdk-17 AS build

# Set the working directory inside the container for the backend app
WORKDIR /app/backend

# Copy only the pom.xml to cache dependencies
COPY pom.xml ./

# Download dependencies (this can be cached by Docker layers to avoid re-downloading)
RUN mvn dependency:go-offline

# Now copy the rest of the source code
COPY . .

# Build the application (skip tests for faster build)
RUN mvn clean install -DskipTests


# Step 2: Run the app using OpenJDK
FROM openjdk:17

# Set the working directory inside the container for the final runtime image
WORKDIR /app

# Copy the jar from the build stage (fix the stage name and jar location)
COPY --from=build /app/backend/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Define the entry point to run the Spring Boot app
ENTRYPOINT ["java", "-Dspring.devtools.restart.enabled=true", "-jar", "app.jar"]