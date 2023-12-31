# kmb

## Candidate notes:

- Many decisions were taken to simplify the project, as this is supposed to be a simple exercise and there's not much time for it
- The simple Front-End part was not created because it's possible to test normally with the REST endpoints
- Added below some improvements that would be required to be done in the case this was a real project

### Potential improvements:
- Enhance design and structure, as this is only simple enough to make the requirements work
- Add unit and e2e testing
- Enhance queries/operations performance
- Enhance input validation and error handling
- Fix the hash bug with the docker environment
- When the worker fails to fetch the data it doesn't issue a job to register the failure scrape, it stucks in the "pending" state


## API Docs

There's a Postman collection with examples in the `/assets` folder to facilitate testing

```
public endpoints:

- POST /user/register
  {
    "username": "",
    "password": ""
  }

- POST /user/login
  {
    "username": "",
    "password": ""
  }

private endpoints:
(requires "Authorization" header with the Bearer JWT token)

- POST /scrape
  {
    "page": ""
  }

- GET /scrape
- GET /scrape/:id

```

## Running the project with Docker

- Ensure you have `Docker` and `docker-compose` installed
- Run one of the commands below in the root folder:
  ```
    $ make up

    or

    $ docker-compose --file ./docker-compose.yml up --detach
  ```
  - Details of services used and ports available are present in the `docker-compose.yml` file
  - The API will be available at `localhost:8000`
  - There's an interface to manage/view the bullmq queue at `localhost:8000/queues` or `localhost:8001/queues`
- 


---
---
---
# Original Description:

---

Technical Test

<br/>

The purpose of this test is to evaluate your ability to solve problems, the use of best
practices and your ability to review functional requirements. Please do not focus on
the frontend, adding a nice look and feel is a nice to have but the evaluator will not
focus on this. Last but not the least as a Company we pay extra attention to the
readability of your solution, the testing that is performed, the completeness of the test
suite, the usage of best practices and patterns, and the instructions for us to run the
project.

---

Summary

<br/>

This is going to be a simple application, where a user can add a link to a web page and
the application will scrape all the information of that page and get a list of all of the
links in that page.

---

Scope

<br/>

You will only check for a tag, any other way that a link could form (i.e. via javascript you
could ignore it).

---

Features

<br/>

```

- As a user, I must be able to register on the platform. For this, it will only be
necessary to enter a username and password.
- As a user, I must be able to log into the system using an email and a password.
- As a user, I should be able to see a list of all the pages that I have scrapped with
the number of links that the scraper found.
- As a user, I should be able to see the details of all the links of a particular page,
that means the url of a link and the “name” of a link.
- As a user I should be able to add a url and the system should be able to check
for all the links and add it to the database. A link will have the following format
<a href="https://www.w3schools.com"> Visit W3Schools.com! </a> the href will
be the link and the body will be the name of the link. Keep in mind that the
body of a link sometimes is not only text and could be other html elements, in
those cases you could save only a portion of the html. The title of the web page
will be the page name. Keep in mind that some pages will take more time than
others to scrape.
Nice to have
- Pagination in the list of pages and the list of links
- As a user, when I see the list of pages, I should be able to see the ones that are
currently being processed.
Guidelines

```