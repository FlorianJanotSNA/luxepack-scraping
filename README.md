
---

# Website Scraping with Node.js

## Utilities

### Axios
**Axios** is used to perform HTTP requests to a specific URL.

### Cheerio
**Cheerio** is used to load the HTTP response and make it understandable. It also allows us to parse and navigate through the HTML content of the page.

### File System (FS)
Once all the information is extracted and the final object is built, **FS** is used to write this object into a JSON file.

## Code Structure

### HTTP Request

With **Axios**, we can perform an **HTTP GET** request to the webpage we want to scrape. This is done using the `axios.get()` method. The returned data can be accessed through `response.data`.

We can then use **Cheerio** to parse the HTML content provided by Axios.

### Useful Methods

- **data.find()** : has different uses
    - **data.find(".one_class")** : looks in the data to find the class **one_class**
    - **data.find("#one_id")** : looks in the data to find the ID **one_id**
    - **data.find("div")** : looks in the data to find all \<div\> elements

- **data.find().text()** : returns the text content of the selected element

- **data.attr("src")** : retrieves the value of the `src` attribute from the selected elements

### JSON Object

After parsing the page and extracting all the necessary data, an object is created with the following structure:

```json
{
    "sponsors": [
        {
            "name": {
                "logoURL": "string",
                "websiteURL": "string",
                "order": "number"
            }
        }
    ],
    "exhibitors": [
        {
            "name": {
                "tag": "string",
                "order": "number",
                "location": "string",
                "isNew": "boolean",
                "domain": "string",
                "luxe_pack_formulation": "boolean"
            }
        }
    ]
}
```

Finally, the object is written to a JSON file using **FS**.

---
