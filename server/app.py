from flask import Flask, request, jsonify
import cv2
from keras.models import load_model
import numpy as np
from keras.applications import ResNet50
from keras.layers import Dense, Flatten, Input, LSTM, TimeDistributed, Embedding, Activation, RepeatVector, Concatenate
from keras.models import Sequential, Model
from keras_preprocessing.sequence import pad_sequences
from tqdm import tqdm
from flask_cors import CORS

# Load the pre-trained ResNet50 model for feature extraction
resnet = ResNet50(include_top=False, weights='imagenet', input_shape=(224, 224, 3), pooling='avg')

print("=" * 50)
print("ResNet50 model loaded")

# Load vocabulary
vocab = np.load("Y:\\caption generator\\server\\vocab.npy", allow_pickle=True).item()
inv_vocab = {v: k for k, v in vocab.items()}

embedding_size = 128
max_len = 40
vocab_size = len(vocab)

# Define the image model
image_model = Sequential()
image_model.add(Dense(embedding_size, input_shape=(2048,), activation='relu'))
image_model.add(RepeatVector(max_len))

# Define the language model
language_model = Sequential()
language_model.add(Embedding(input_dim=vocab_size, output_dim=embedding_size, input_length=max_len))
language_model.add(LSTM(256, return_sequences=True))
language_model.add(TimeDistributed(Dense(embedding_size)))

# Combine the models
conca = Concatenate()([image_model.output, language_model.output])
x = LSTM(128, return_sequences=True)(conca)
x = LSTM(512, return_sequences=False)(x)
x = Dense(vocab_size)(x)
out = Activation('softmax')(x)
model = Model(inputs=[image_model.input, language_model.input], outputs=out)

# Compile the model using MSE loss function
model.compile(loss='mean_squared_error', optimizer='RMSprop', metrics=['accuracy'])
mine_model_weights.compile(loss='mean_squared_error', optimizer='RMSprop', metrics=['accuracy'])

# Load model weights
model.load_weights('Y:\\caption generator\\server\\mine_model_weights.h5')

print("=" * 50)
print("Model loaded")

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/after', methods=['POST'])
def after():
    global model, vocab, inv_vocab
    file = request.files['file']

    file.save('Y:\\caption generator\\server\\static\\file.jpg')
    img = cv2.imread('Y:\\caption generator\\server\\static\\file.jpg')
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = np.reshape(img, (1, 224, 224, 3))

    features = resnet.predict(img).reshape(1, 2048)

    print("=" * 50)
    print("Predict Features")

    text_in = ['startofseq']
    final = ''

    print("=" * 50)
    print("Getting Captions")

    count = 0
    while tqdm(count < 20):
        count += 1

        encoded = [vocab[i] for i in text_in]

        padded = pad_sequences([encoded], maxlen=max_len, padding='post', truncating='post').reshape(1, max_len)

        sampled_index = np.argmax(model.predict([features, padded]))

        sampled_word = inv_vocab[sampled_index]

        if sampled_word != 'endofseq':
            final = final + ' ' + sampled_word

        text_in.append(sampled_word)

    return jsonify({'caption': final})

if __name__ == "__main__":
    app.run(debug=True)
