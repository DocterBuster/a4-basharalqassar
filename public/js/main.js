
//React Code





// FRONT-END (CLIENT) JAVASCRIPT HERE

let tableIndex = 0;
let user = "";
let userPassword = "";

const login = async function( event ) {

  event.preventDefault()

  console.log("test login button pressed")

  const input = document.querySelector( "#userlogin"),
      json = { username: input[0].value, password: input[1].value },
      body = JSON.stringify( json )

  console.log(json)

  user = json.username
  userPassword = json.password


  const getAccount = await fetch("/post_login",
      {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      })

  const loginAttempt = await getAccount.json()
  console.log(loginAttempt)

  if(loginAttempt === "PasswordIncorrect")
  {
    alert("Account Password is incorrect")
    clearTable()
  }
  else if(loginAttempt === "AccountCreated")
  {
    alert("Account Created! Please Add data!")
    clearTable()
  }
  else
  {
    addUserData(loginAttempt)
  }

}

const submit = async function( event ) {

  event.preventDefault()
  
  const input = document.querySelector( "#userinput"),
       json = { username: user, password: userPassword, score: input[0].value, time: input[1].value, date: input[2].value },
       body = JSON.stringify( json )

  //let newData = { "username": input[0].value, "score": input[1].value, "time": input[2].value }

  const response = await fetch("/add_userdata", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json)
  })

  document.getElementById("loginButton").click()
  console.log("Test")

   //const updatedData = await response.json()
   //console.log(updatedData)
  //addUserData(updatedData)



  //Reload page to show changes to the dataset


}

const deleteData = async function( event ) {

  event.preventDefault()
  console.log("Deleting Data")

  const input = document.querySelector( "#userinput"),
      json = { username: user, password: userPassword, score: input[0].value, time: input[1].value, date: input[2].value },
      body = JSON.stringify( json )

  //let newData = { "username": input[0].value, "score": input[1].value, "time": input[2].value }

  const response = await fetch("/delete_userdata", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json)
  })

  document.getElementById("loginButton").click()
  console.log("Test")


}



//ONLOAD Function:
window.onload = async function() {

  const loginButton = document.getElementById("loginButton")
  loginButton.onclick = login;

  const button = document.getElementById("dataButton");
  button.onclick = submit;

  const deleteButton = document.getElementById("deleteButton");
  deleteButton.onclick = deleteData;


}




//Add all the User Data
async function addUserData(userData)
{
  clearTable()
  tableIndex = 0;
  const table = document.getElementById("InformationTable")

  for(let i = 0; i < userData.length; i++)
  {
    tableIndex++
    let row = table.insertRow(tableIndex)

    for(let j = 0; j <= 3; j++)
    {
      let cell = row.insertCell(j)

      if(j == 0)
      {
        cell.innerHTML = userData[i].score;
      }
      else if(j == 1)
      {
        cell.innerHTML = userData[i].time;
      }
      else if(j == 2)
      {
        cell.innerHTML = userData[i].scoreOverTime;
      }
      else if(j == 3)
      {
        let dateButton = document.createElement("button")
        dateButton.textContent = userData[i].date;
        dateButton.onclick = dateButtonClick

        cell.appendChild(dateButton)

      }
    }

  }

}


//What happens when a date button is clicked
const dateButtonClick = async function( event ) {
  event.preventDefault()

  let dateBox = document.getElementById("date")
  dateBox.value = event.target.firstChild.data
}



function clearTable()
{
  const table = document.getElementById("InformationTable")

  console.log(table.rows.length)
  console.log(table.rows)

  if(table.rows.length !== 1)
  {
    for(let i = table.rows.length - 1; i > 0; i--)
    {
      table.rows[i].remove();
    }
  }

}