import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(
        default="sqlite:///./inventory.db",
        validation_alias="DATABASE_URL"
    )

    POSTGRES_DB: str = "inventory_db"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    SECRET_KEY: str = "supersecretkeydevelopmentonlydontuseinprod123!"
    
    # Allow loading from a .env file if it exists
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
