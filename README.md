# Test Interview App: URL Shortener

Welcome to the Test Interview App for a URL Shortener! This app allows you to create shortened URLs using Node.js and Docker.

## Requirements

Before you begin, make sure you have the following installed on your machine:

1. Node.js (version 18.19.0)
2. Docker

## Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener

2. Copy the .env.template file to create a new .env file. all the variables are set to run in a local environment.:


    ```bash
    cp .env.template .env

3. Start the Docker container:

    ```docker-compose up```

4. Install dependencies

    ```npm install```

5. Run the app

    ```npm run start:dev```

6. To run test:

    ```npm run test:watch```

7. (`OPTIONAL`) with the app running, hit the endpoint: `api/seed` to populate the database with data if needed.

## Usage

This app takes a numeric counter as input by `POST` an `url` string to `api/urls` with the following payload:

`{
    "original": "http://example.com"
}`

then encodes it into a short string using a custom alphabet. The encoding is similar to base conversion but uses a specific set of characters defined in the ALPHABET array (` 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'`). The app performs the following steps:

1) If the counter is 0, it returns the first character of the ALPHABET.

2) For non-zero counter values, the function iterates through a loop, repeatedly dividing the counter by the length of the ALPHABET and appending the corresponding character to the shortenedUrl.

3) Finally, the function reverses the order of characters in shortenedUrl and returns the result.

```
    {
        "original": "http://example.com",
        "shortened": "http://localhost:3000/D85WhyM",
        "counter": 1703028521186,
        "id": "97f7d585-8cce-4e48-b41a-9447f0f90f42",
        "visits": 0
    }
```
## Endpoints and Functionalities

1) `POST => api/urls`

    Action to insert a new url to the database. 

    For Explample, the payload:
    ```{ "original": "http://example.com"}```
    Will insert the url to the database giving the result:
    ```
        {"original": "http://example.com", "shortened": "http://localhost:3000/D85WhyM", "counter": 1703028521186, "id": "97f7d585-8cce-4e48-b41a-9447f0f90f42", "visits": 0}
    ```

2) `GET => api/urls`
    Action to fetch the top 100 urls ordered by their `visits` descending.

    For example:
    ```
        [
            {
                "id": "5df63b5e-f328-4a83-9acd-e95da981b669",
                "original": "http://johnssson.com",
                "shortened": "http://localhost:3000/D84HiRt",
                "counter": "1703010174933",
                "visits": 23
            },
            {
                "id": "d777b4c4-ecee-41ac-8ee2-02b2ef148818",
                "original": "http://yahoo.com",
                "shortened": "http://localhost:3000/D81WYNH",
                "counter": "1702969582059",
                "visits": 0
            },
        ]
    ```
3) `GET => api/urls/:term`

    Action to fetch a specific url by its id, counter, original or shortened url.

    For example the `GET` request:
    `` api/urls/97f7d585-8cce-4e48-b41a-9447f0f90f42 ``
    Will return:
    ```
        {
            "id": "97f7d585-8cce-4e48-b41a-9447f0f90f42",
            "original": "http://example.com",
            "shortened": "http://localhost:3000/D85WhyM",
            "counter": "1703028521186",
            "visits": 1
        }
    ```
    Increasing its `visits` +1 per request.
4) `PATCH => api/urls/id`

    Action to update the `original` url of a entry. 

    For example, by `PATCH` thorough `api/urls/97f7d585-8cce-4e48-b41a-9447f0f90f42`, with the following payload:
    ```
        {
            "original": "http://example2.com"
        }
    ```
    Will result:
    ```
        {
            "id": "97f7d585-8cce-4e48-b41a-9447f0f90f42",
            "original": "http://example2.com",
            "shortened": "http://localhost:3000/D8503D8",
            "counter": 1703029659342,
            "visits": 1
        }
    ```

5) `DELETE => api/urls/id` 

    Action to delete an URL from the database by its id.

    For example, by `DELETE` through `api/urls/97f7d585-8cce-4e48-b41a-9447f0f90f42`,  will result:

    ```
        url with id 97f7d585-8cce-4e48-b41a-9447f0f90f42 was deleted.
    ```

## Notes

Make sure to set up your environment variables in the .env file before starting the Docker container.

All required packages can be installed using npm install.
The autoLoadEntities option is set to true, allowing all entities to be created in the database once the app is running.

Feel free to explore the app, create shortened URLs, and test its functionality! If you encounter any issues or have questions, feel free to contact me.


