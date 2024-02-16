from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import Summarizer
import torch

app = Flask(__name__)
CORS(app)


@app.route('/summarize', methods=['POST'])
def summarize_text():
    
    try:
        
        content = request.json['text']

        
        chunk_size = 500
        text_chunks = [content[i:i + chunk_size] for i in range(0, len(content), chunk_size)]

        # Use BERT for tokenization and summarization
        model = Summarizer()

        # Generate summaries using BERT
        bert_summaries = [model(chunk, ratio=0.1) for chunk in text_chunks]
        print(bert_summaries)

        return jsonify({
            'bert_summaries': bert_summaries
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

