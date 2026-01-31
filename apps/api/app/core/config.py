from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_user: str = "violet"
    postgres_password: str = "violet"
    postgres_db: str = "violetfund"
    postgres_host: str = "postgres"
    postgres_port: int = 5432
    jwt_secret: str = "dev-secret-change"
    jwt_algorithm: str = "HS256"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"


settings = Settings()
