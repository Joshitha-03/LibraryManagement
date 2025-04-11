from flask import Flask, jsonify, render_template_string
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(
    __name__,
    static_folder='../public',   # Serving static files like JS, CSS
    static_url_path=''
)

CORS(app)  # This enables CORS for your Flask app
# MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/LibraryDB"
mongo = PyMongo(app)

@app.route('/api/user/getRecommendedBooks', methods=['GET'])
def get_recommended_books():
    # Fetch recommended books from the MongoDB
    recommended_books = mongo.db.books.find().sort("rating", -1).limit(5)
    books = []
    for book in recommended_books:
        books.append({
            "title": book['title'],
            "bookId": book['bookId'],
            "author": book['author'],
            "quantity":book['quantity'],
            "rating": book['rating'],
            "price": book['price'],
            "description": book['description'],
            "image": book['image']  # Ensure image field exists in your database
        })
    return jsonify(books)

# Optional: Render the user dashboard HTML with book recommendations
@app.route('/userdashboard')
def user_dashboard():
    top_books = mongo.db.books.find().sort("rating", -1).limit(5)

    # Read the HTML content manually
    with open('../public/userdashboard.html', 'r') as file:
        html_content = file.read()

    return render_template_string(html_content, recommended_books=top_books)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
