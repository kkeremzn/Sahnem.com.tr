# =========================
# 1. BUILD
# =========================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Solution'daki projeleri kopyala
COPY . .

# API projesini restore et
RUN dotnet restore Sahnem.API/Sahnem.API.csproj

# API'yi publish et
RUN dotnet publish Sahnem.API/Sahnem.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# =========================
# 2. RUNTIME
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "Sahnem.API.dll"]

