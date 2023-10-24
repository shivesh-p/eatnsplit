import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  function handleAddForm() {
    setshowAddForm((c) => (c = !c));
  }
  function handleFriendsListAdd(friend) {
    setfriends((c) => [...c, friend]);
    setshowAddForm(false);
  }
  function handleSelectedFriend(friend) {
    setselectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setshowAddForm(false);
  }

  function handleBillSplit(value) {
    // console.log(value);
    setfriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setselectedFriend(null);
  }

  const [friends, setfriends] = useState(initialFriends);
  const [showAddForm, setshowAddForm] = useState(false);
  const [selectedFriend, setselectedFriend] = useState(null);
  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          selectedFriend={selectedFriend}
          friends={friends}
          onFriendSelected={handleSelectedFriend}
        ></Friends>
        {showAddForm && (
          <FriendForm onFriendAdded={handleFriendsListAdd}></FriendForm>
        )}
        <Button onButtonClick={handleAddForm}>
          {showAddForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <BillSplitForm
          key={selectedFriend.id}
          friend={selectedFriend}
          onBillSplit={handleBillSplit}
        ></BillSplitForm>
      )}
    </div>
  );
}

function Friends({ friends, onFriendSelected, selectedFriend }) {
  const friendsList = friends;
  return (
    <ul>
      {friendsList.map((item) => (
        <Friend
          selectedFriend={selectedFriend}
          item={item}
          key={item.id}
          onFriendSelected={onFriendSelected}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ item, onFriendSelected, selectedFriend }) {
  const isSelected = item.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={item.image} alt={item.name}></img>
      <h3>{item.name}</h3>
      {item.balance < 0 && (
        <p className="red">
          You owe {item.name} {Math.abs(item.balance)}$
        </p>
      )}
      {item.balance > 0 && (
        <p className="green">
          {item.name} owes you {Math.abs(item.balance)}$
        </p>
      )}
      {item.balance === 0 && <p className="">{item.name} and you are even.</p>}
      <Button onButtonClick={() => onFriendSelected(item)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onButtonClick }) {
  return (
    <button onClick={onButtonClick} className="button">
      {children}
    </button>
  );
}

function FriendForm({ onFriendAdded }) {
  const [name, setname] = useState("");
  const [url, seturl] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !url) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${url}?=${id}`,
      balance: 0,
    };
    console.log(newFriend);
    onFriendAdded(newFriend);
    setname("");
    seturl("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friends Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname((c) => (c = e.target.value))}
      ></input>
      <label>🏞️ Avatar Url:</label>
      <input
        type="text"
        value={url}
        onChange={(e) => seturl((c) => (c = e.target.value))}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function BillSplitForm({ friend, onBillSplit }) {
  const [bill, setbill] = useState(0);
  const [amt, setAmt] = useState(0);
  const friendAmt = bill - amt;
  const [isPaidBy, setisPaidBy] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!isPaidBy || !bill) return;
    onBillSplit(isPaidBy === "user" ? friendAmt : -amt);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>

      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(+e.target.value)}
      ></input>

      <label>😊 Your Expense</label>
      <input
        type="text"
        value={amt}
        onChange={(e) => setAmt(+e.target.value > bill ? amt : +e.target.value)}
      ></input>

      <label>🧑‍🤝‍🧑 {friend.name}'s Expense</label>
      <input type="text" disabled value={friendAmt}></input>

      <label>🤔 Who is paying the bill?</label>
      <select value={isPaidBy} onChange={(e) => setisPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
