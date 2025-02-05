
#docs
https://platform.openai.com/docs/guides/text-to-speech

#Generate JSON data based on a JSON Schema

import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
        { role: "developer", content: "You extract email addresses into JSON data." },
        {
            role: "user",
            content: "Feeling stuck? Send a message to help@mycompany.com.",
        },
    ],
    response_format: {
        // See /docs/guides/structured-outputs
        type: "json_schema",
        json_schema: {
            name: "email_schema",
            schema: {
                type: "object",
                properties: {
                    email: {
                        description: "The email address that appears in the input",
                        type: "string"
                    }
                },
                additionalProperties: false
            }
        }
    },
    store: true,
});

console.log(completion.choices[0].message.content);



#Describe the contents of an image
import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {
            role: "user",
            content: [
                { type: "text", text: "What's in this image?" },
                {
                    type: "image_url",
                    image_url: {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                    },
                }
            ],
        },
    ],
    store: true,
});

console.log(completion.choices[0].message);


#Create a human-like response to a prompt
import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "developer", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
    store: true,
});

console.log(completion.choices[0].message);


#vision
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What's in this image?" },
        {
          type: "image_url",
          image_url: {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
          },
        },
      ],
    },
  ],
  store: true,
});

console.log(response.choices[0]);


#base64
import base64
from openai import OpenAI

client = OpenAI()

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Path to your image
image_path = "path_to_your_image.jpg"

# Getting the Base64 string
base64_image = encode_image(image_path)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What is in this image?",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                },
            ],
        }
    ],
)

print(response.choices[0])


#image understanding
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What's in this image?" },
        {
          type: "image_url",
          image_url: {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
            "detail": "low"
          },
        },
      ],
    },
  ],
  store: true,
});

console.log(response.choices[0]);

##image generate
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "a white siamese cat",
  n: 1,
  size: "1024x1024",
});

console.log(response.data[0].url);

#variations
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.images.createVariation({
  model: "dall-e-2",
  image: fs.createReadStream("corgi_and_cat_paw.png"),
  n: 1,
  size: "1024x1024"
});

console.log(response.data[0].url);