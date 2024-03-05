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
  const [isShown, setIsshown] = useState(false);
  const [addFriend, setAddFriend] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const handleShownToggle = () => {
    setIsshown((is) => !is);
  };

  const handleAddFriend = (friend) => {
    setAddFriend((friends) => [...friends, friend]);
    handleShownToggle();
  };

  const handleSelection = (friend) => {
    // setSelectedFriend(friend);

    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  };

  function handleSplitBill(value) {
    setAddFriend((friends) =>
      friends.map((friend) =>
        selectedFriend.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={addFriend}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {isShown && <FormAddFriend addFriend={handleAddFriend} />}
        <Button onClick={handleShownToggle}>
          {isShown ? "Close" : " Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick} style={{ marginTop: "16px" }}>
      {children}
    </button>
  );
}
function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance == 0 && (
        <p className="green" style={{ color: "grey" }}>
          You and {friend.name} are even
        </p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ addFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    addFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <label>💕Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>😍Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>😒 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>😁 X's expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>😘 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split</Button>
    </form>
  );
}
