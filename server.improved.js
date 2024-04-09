import express from "express";
import ViteExpress from "vite-express";
import {MongoClient} from "mongodb";

const app = express();


const logger = (req, res, next) => {
  //console.log('url:', req.url)
  next()
}

app.use(logger)
app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

const uri = `mongodb+srv://docterbuster:WrAcuHkhqtPSf1OQ@a3-basharalqassar-clust.h6f3nj7.mongodb.net/`
const client = new MongoClient( uri )


let collection = null
let userdata = null

async function run() {
  await client.connect()
  collection = await client.db("a3-basharalqassar-db").collection("users")
  userdata = await client.db("a3-basharalqassar-db").collection("user-appdata")
  // route to get all docs
}

run()

app.post("/post_login", async (req, res) => {
  if (collection !== null) {

    let loginInfo = req.body


    const accountExists = await collection.countDocuments(
        {
          username: loginInfo.username
        }
    )
    console.log(accountExists)

    if(accountExists !== 0)
    {
      //Query for this account to find an exact match
      const docs = await collection.find(
          {
            username: loginInfo.username,
            password: loginInfo.password
          }
      ).toArray()
      //res.json( docs )

      //If we find an account
      if(docs[0] !== undefined)
      {
        //Query userdata for this user and return all associated data
        const selectedUserData = await userdata.find(
            {
              username: loginInfo.username
            }
        ).toArray()
        res.json( selectedUserData )
        //console.log(selectedUserData)

      }
      //If no account is found, that means the password is wrong
      else
      {
        //console.log("No Data found for " + loginInfo.username + "with password " + loginInfo.password)
        res.json("PasswordIncorrect")
      }
    }
    else
    {
      let newUser = {username: loginInfo.username, password: loginInfo.password}
      const updatedData = collection.insertOne(newUser)
      console.log("Created New user: " + loginInfo.username)
      res.json("AccountCreated")
    }



  }
})

app.post("/add_userdata", async (req, res) => {
  if (userdata !== null)
  {
    console.log("Adding/Updating User Data")

    //User we are logged in for
    let user = req.body.username;

    console.log(req.body.password)

    //Query for this account (before we add data)
    const docs = await collection.find(
        {
          username: req.body.username,
          password: req.body.password
        }
    ).toArray()

    //If we find an account
    if(docs[0] !== undefined)
    {
      console.log("User Found!")
      //Query userdata for data with this user on a specific date

      const query =
          {
            username: user,
            date: req.body.date
          };

      const userScoreOnDate = await userdata.find(query).toArray()

      //If we find data, update it
      if(userScoreOnDate[0] !== undefined)
      {
        console.log("Replacing Data")

        let newData =
            {
              _id: userScoreOnDate[0]._id,
              score: req.body.score,
              time: req.body.time,
              scoreOverTime: Math.round((req.body.score / req.body.time) * 10) / 10,
              date: req.body.date,
              username: user
            };

        const updatedData = userdata.replaceOne(query, newData)

        console.log(updatedData)
        res.json(updatedData)

      }
      else //otherwise, add this information to the dataset
      {
        console.log("Adding Data")

        let newData =
            {
              score: req.body.score,
              time: req.body.time,
              scoreOverTime: Math.round((req.body.score / req.body.time) * 10) / 10,
              date: req.body.date,
              username: user
            };

        const updatedData = userdata.insertOne(newData)

        console.log(updatedData)
        res.json(updatedData)
      }

      // console.log(userScoreOnDate)
    }
    else
    {
      //Don't add any data if we don't find an account
      res.json("Account Not Logged in")
    }



    //Return updated user data with res
  }
})

app.post("/delete_userdata", async (req, res) => {
  if (userdata !== null)
  {
    console.log("Deleting Userdata")

    //User we are logged in for
    let user = req.body.username;

    console.log(req.body.password)

    //Query for this account (before we delete data)
    const docs = await collection.find(
        {
          username: req.body.username,
          password: req.body.password
        }
    ).toArray()

    //If we find an account
    if(docs[0] !== undefined)
    {
      console.log("User Found!")
      //Query userdata for data with this user on a specific date

      const query =
          {
            username: user,
            date: req.body.date
          };

      const deletedData = await userdata.deleteOne(query)
      res.json(deletedData)

    }
    else
    {
      //Don't delete any data if we don't have a valid account
      res.json("Account Not Logged in")

    }



    //Return updated user data with res
  }
})


app.get('/login.html', (req, res) => res.send('Hello World!'))


app.post('/post_account', (req, res) =>
{
  let loginInfo = req.body
  console.log(loginInfo)

  /*
    username: loginInfo.username,
    password: loginInfo.password
  */

})



ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));






