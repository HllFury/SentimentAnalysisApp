import express from "express"; // backend api
import axios from "axios"; // requests!


// MIDDLEWARE!
import cors from "cors"; // enforce CORS, will be set to frontend URL when deployed
import morgan from "morgan"; // useful for tracking request logs
import helmet from "helmet"; // ensures max security for server
import StatusCodes from "http-status-codes"; // status codes!
import bodyParser from "body-parser";
import language from "@google-cloud/language";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


const app = express();
const cors_conf = {
  origin: ["http://localhost:5000"], // temporary
  methods: ["POST"],
};

app.use(morgan("common"));
app.use(cors(cors_conf));
app.use(helmet());
app.use(bodyParser.json()); // for parsing application/json
app.listen(5000, function () {
  console.log("server starting...");
});

const twitter_base_url = "https://api.twitter.com/2";
const instance = axios.create({
  baseURL: twitter_base_url,
  headers: { Authorization: `Bearer ${process.env.bearer_token}` },
});

// analyze/id/ endpoint...
app.post("/analyze/:id", function (request, response) {
  const id_length = request.params.id.length;

  if (id_length !== 19) {
    response.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid ID.",
      message: "ID must be a 19-character long Tweet ID.",
    });
  } else {
    let tweet_id = request.params.id;
    let twitter_formatted_url = buildURL(tweet_id);
    instance.get(twitter_formatted_url).then((res) => {
      let responseForFrontend = sendRequestToTwitter(res);
      responseForFrontend.then((data) => {
        if (responseForFrontendIsError(data)) {
          response.status(StatusCodes.BAD_REQUEST).json(data);
        } else {
          response.status(StatusCodes.OK).json(data);
        }
      });
    });
  }
});

async function sendRequestToTwitter(twitter_response) {
  /**
   * send GET request to twitters /2/tweets/?id=[tweet ID] endpoint.
   *
   * @param twitter_response -> ``JSON response``, the response from Twitter.
   * @returns : an Object containing data about the tweet (tweet text, author, time, etc...)
   */

  console.log("sending request to twitter...");
  try {
    let twitter_json_data = twitter_response.data;
    let tweet_text = await extractText(twitter_json_data);
    let tweet_id = await extractId(twitter_json_data);
    console.log(tweet_id, tweet_text);
    return {
      text: tweet_text,
      id: tweet_id,
    };
  } catch (error) {
    console.error(error.message);
    return {
      error: error.message,
      full_stack: error,
    };
  }
}
function buildURL(tweet_id) {
  /**
   * helper function that builds the twitter URL to send the GET request to.
   *
   * @param tweet_id -> ``string`` the ID of the tweet to request.
   * @returns fully-formatted Twitter URL.
   */
  let endpoint_and_param = `/tweets?ids=${tweet_id}`;
  return twitter_base_url.concat(endpoint_and_param);
}

function extractId(tweet_response) {
  /**
   * extract the tweet ID from the tweet response object.
   *
   * @param tweet_response -> tweet response object from GET request sent to /tweets?ids=[ids...]
   * @returns : the ID of the first tweet in the response object.
   * */
  if (tweetIdIsValid(tweet_response)) {
    return tweet_response.data[0].id;
  } else {
    return tweet_response.errors[0].value;
  }
}

function extractText(tweet_response) {
  /**
   * extract the tweet text from the tweet response object.
   *
   * @param tweet_response -> tweet response object from GET request sent to /tweets?ids=[ids...]
   * @returns : the text of the first tweet in the response object.
   * */
  if (tweetIdIsValid(tweet_response)) {
    return tweet_response.data[0].text;
  } else {
    return {
      message: tweet_response.errors[0].title,
      error: tweet_response.errors[0].detail,
    };
  }
}

function tweetIdIsValid(tweet_response) {
  /**
   * helper function to check if the tweet 19-character ID passed is valid.
   *
   * @param tweet_response -> the response from Twitters API /2/tweets?ids
   * @returns : true is a key named "data" exists, false otherwise.
   */
  return tweet_response.data ? true : false;
}

function responseForFrontendIsError(responseForFrontend) {
  /**
   * check if response sent to frontend is 200 OK...
   *
   * If the type is an object then it is an error and 400 BAD REQUEST should be sent. Otherwise, 200 OK.
   *
   * It is important to check that the value is ALSO not null, because null type in JS is an object.
   * In this context, .text should never be null.
   * https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
   *
   * @param responseForFrontend -> the response being sent to the frontend.
   * @returns boolean value denoting whether the response is valid or not. true is error, false is not.
   *
   */
  return (
    typeof responseForFrontend.text === "object" &&
    responseForFrontend.text !== null
  );
}

/**
 * Requests to google NLP
 */

app.post("/google/analyze", async (req, res) => {
  const { doc } = req.body;
  try {
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS, process.env.TEST, "\n");
    const response = await analyzeSentiment(doc)
    
    if (response) {
      res.send(response);
    }
  } catch (err) {
    res.status(401).send("error");
  }

});

async function analyzeSentiment(doc) {
    /**
   * function to make request to google NLP api
   *
   * @param doc -> the text that will be analyzed
   * @returns : result from the api, containing a score and magnitude
   */
  try {
    // Instantiates a client
    const client = new language.LanguageServiceClient();

    // The text to analyze
    const text = doc;

    const document = {
      content: text,
      type: "PLAIN_TEXT",
    };

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({ document: document });
    const sentiment = result.documentSentiment;

    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

    if (result) {
      return result;
    }
  } catch (err) {
    console.log(err);
  }
}


