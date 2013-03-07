from mongoengine import *
from flask import Flask, request, redirect, url_for, render_template, jsonify, Response

app = Flask(__name__)

connect('sh4r3')

class Image(DynamicDocument):
    token = StringField()
    content = StringField()

@app.route('/')
def index():
    return render_template('index.html')

''' Salva a imagem na db '''
@app.route('/save', methods=['POST', 'GET'])
def save():
    if request.method=='POST':
        if request.form['token']:
            image = Image()
            image.token = request.form['token']
            image.content = request.form['content']
            image.save()
        return jsonify(result=true)

''' Visualiza a imagem '''
@app.route('/view/<token>')
def view(token=None):

    content = {}

    for i in Image.objects(token=token):
        content['content']= i.content
        content['token'] = i.token

    if content:
        return render_template('view.html', content=content)
    else:
        return render_template('ops.html', content=content)


''' Lista todas imagens '''
@app.route('/all')
def all():
    content = {}
    for img in Image.objects:
        content[img.token] = {
            'content': img.content
        }
    return jsonify(content)


if __name__ == '__main__':
    app.run(debug=True)

