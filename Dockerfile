# ============================
# 1️⃣ Build Frontend (React)
# ============================
FROM node:20-alpine AS frontend-build
WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm ci

COPY ./frontend ./
RUN npm run build


# ============================
# 2️⃣ Build Backend (.NET Onion)
# ============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/SprintPlanner.API/*.csproj SprintPlanner.API/
COPY backend/SprintPlanner.Application/*.csproj SprintPlanner.Application/
COPY backend/SprintPlanner.Domain/*.csproj SprintPlanner.Domain/
COPY backend/SprintPlanner.Infrastructure/*.csproj SprintPlanner.Infrastructure/

RUN dotnet restore SprintPlanner.API/SprintPlanner.API.csproj

COPY backend/. .

RUN dotnet publish SprintPlanner.API/SprintPlanner.API.csproj -c Release -o /app/publish


# ============================
# 3️⃣ Runtime
# ============================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app

COPY --from=build /app/publish .
COPY --from=frontend-build /app/dist ./wwwroot

# ✅ CHANGE HERE
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "SprintPlanner.API.dll"]