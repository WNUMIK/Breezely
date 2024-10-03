from app import create_app

app = create_app()

print("Flask app initialized")

if __name__ == "__main__":
    app.run(debug=True)
