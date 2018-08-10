<template>
        <v-app toolbar footer>
            <!-- removed v-container -->
            <v-navigation-drawer clipped floating fixed v-model="showUsers" app>

                <!-- Usernames + PM button
                        <b-list-group class="usernames" id='usernames'>
                                <b-list-group-item v-for="user in users" :key="user.userID" class="usernames">
                                    <b-button class="PMbutton" v-if="usernameChosen" @click="privateMessage(user.username)">@</b-button>
                                    <div>{{ user.username }}</div>
                                </b-list-group-item>
                            </b-list-group>
                        -->

                <v-list subheader id='usernames'>
                    <v-subheader>Online</v-subheader>

                    <v-list-tile v-for="user in users" :key="user.userID" avatar>
                        <v-list-tile-content>
                            <v-list-tile-title v-html="user.username"></v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>chat_bubble_outline</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>

                </v-list>
            </v-navigation-drawer>

            <v-toolbar app fixed clipped-left dense>
                <v-icon @click.stop="showUsers = !showUsers">people</v-icon>
                <v-toolbar-title>#VueChat</v-toolbar-title>
                <v-icon id="goDown" v-scroll-to="{
                    el: '#bottom',
                    container: 'body',
                    duration: 100,
                    easing: 'ease',
                    offset: -200,
                    cancelable: false,
                    x: false,
                    y: true,
                    }">arrow_downward</v-icon>
            </v-toolbar>

            <v-content>

                <v-layout row wrap>

                    <!-- Chat messages -->
                    <v-flex xs-8 class="chatMessageBody" v-if="usernameChosen && messagingChat">
                        <v-list three-line id='chatMessages'>
                            <v-list-tile v-for="message in filterChatMessages" :key="message.id">
                                <v-list-tile-content>
                                    <v-list-tile-title> {{ message.username }} </v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        <span class="chatBubble"> {{ message.messageText }} </span>
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <div id="bottom"></div>
                        </v-list>
                    </v-flex>

                    <!-- Private Messaging -->
                    <v-flex xs-8 v-if="messagingUser">
                        <v-list three-line id='privateMessages'>
                            <v-list-tile v-for="message in userPrivateMessages" :key="message.id">
                                <v-list-tile-content>
                                    <v-list-tile-title> {{ message.username }} </v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        <span class="chatBubble"> {{ message.messageText }} </span>
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-flex>
                </v-layout>
                <v-footer height="auto" app fixed>
                    <v-layout row wrap>

            
                                <v-flex xs-8 v-if="usernameChosen && messagingChat && usersTypingText.length > 0">
                                    <div>
                                        {{ usersTypingText }}
                                    </div>
                                </v-flex>
                                
                            

                        <!-- Username Input -->

                        <v-flex xs-8 v-if="!usernameChosen">

                            <v-text-field solo v-model="username" @keydown.enter="usernameFormSubmit" id='usernameInput' type='text' class='form-control'
                                placeholder='Enter your username.'></v-text-field>

                        </v-flex>

                        <!-- Message Input -->

                        <v-flex xs-8 v-if="usernameChosen && messagingChat">

                            <v-text-field solo class="chatMessageInput" @keydown.enter="messageFormSubmit" @keyup.enter="this.typing = false" v-model="message" v-on:input="checkIfTyping"
                                id='messageInput' type='text' placeholder='Send a message.'></v-text-field>

                        </v-flex>

                        <!-- Private Message Input -->

                        <v-flex xs-8 v-if="usernameChosen && messagingUser">

                            <v-form-input class="privateMessageInput" @keydown.enter="privateMessageFormSubmit" v-model="privateMessageText" @keydown.esc="hidePrivateMessagesShowChat"
                                id='privateMessageInput' type='text' :placeholder='pmPlaceholder'></v-form-input>

                        </v-flex>

                    </v-layout>
                </v-footer>

            </v-content>

            <!--
            <v-footer height="auto" app fixed>
                <v-layout justify-center row wrap>

                     Usernames currently typing 

                    <v-flex xs-8 v-if="usernameChosen && messagingChat">
                        <div>
                            {{ usersTypingText }}
                        </div>
                    </v-flex>
                    
                    

                    

                    <v-flex xs-8 v-if="!usernameChosen">
                        <v-form @submit="usernameFormSubmit" id='usernameForm'>
                            <v-text-field v-model="username" id='usernameInput' type='text' class='form-control' placeholder='Enter your username.'>
                        </v-form>
                    </v-flex>

                    

                    <v-flex app xs-8 v-if="usernameChosen && messagingChat">
                        <v-form @submit="messageFormSubmit" id='messageForm'>
                            <v-text-field class="chatMessageInput" v-model="message" v-on:input="checkIfTyping" id='this.messageInput' type='text' class='form-control'
                                placeholder='Send a message.'>
                        </v-form>
                    </v-flex>


                    <v-flex xs-8 v-if="usernameChosen && messagingUser">
                        <v-form @submit="privateMessageFormSubmit" id='privateMessageForm'>
                            <v-form-input class="privateMessageInput" v-model="privateMessageText" @keydown.esc="hidePrivateMessagesShowChat" id='privateMessageInput'
                                type='text' class='form-control' :placeholder='pmPlaceholder'>
                        </v-form>
                    </v-flex>

                </v-layout>
            </v-footer>
        -->
        </v-app>
</template>

<script>
export default {
  name: "HelloWorld",

  data() {
    return {
      socket: io.connect("http://localhost:3000"),
      pmPlaceholder: "",
      privateMessageTo: "",
      users: [
      {
        userID: 1,
        username: "j4ck"
      },
      {
        userID: 2,
        username: "dingus"
      },
      {
        userID: 3,
        username: "pRICk"
      },
      {
        userID: 4,
        username: "mICK"
      },
      {
        userID: 5,
        username: "bl!Ck"
      }
    ],
    messages: [
      {
        id: 1,
        username: "j4ck",
        messageText: "y0 b1tCh3zzz JACK IN DA HIZZY",
        private: false
      },
      {
        id: 2,
        username: "j4ck",
        messageText: "PRIVATE Fr0m j4CK",
        private: true
      },
      {
        id: 3,
        username: "dingus",
        messageText: "dINGUSSSSS",
        private: false
      },
      {
        id: 4,
        username: "dingus",
        messageText: "DINGUS SENDING PRIVATE",
        private: true
      },
      {
        id: 5,
        username: "pRICk",
        messageText: "AWWWW YISSS",
        private: false
      },
      {
        id: 6,
        username: "pRICk",
        messageText: "communique!",
        private: true
      },
      {
        id: 7,
        username: "mICK",
        messageText: "BLAHBLAHBLAH",
        private: false
      },
      {
        id: 8,
        username: "mICK",
        messageText: "heyyyy",
        private: true
      },
      {
        id: 9,
        username: "mICK",
        messageText: "HEY",
        private: true
      },
      {
        id: 10,
        username: "bl!Ck",
        messageText: "!!!!!!",
        private: false
      },
      {
        id: 11,
        username: "bl!Ck",
        messageText: "bliVKK PRVT",
        private: true
      }
    ],
    userPrivateMessages: [],
    usernameChosen: false,
    username: "",
    userID: "",
    showUsers: false,
    messagingChat: false,
    messagingUser: false,
    message: "",
    trimmedMessage: "",
    privateMessageText: "",
    typing: false,
    usersTyping: [],
    usersTypingText: "j4ck is typing.",
    messageID: 12,
    usernameID: 6,
    lastMessage: "",
    title: 'Vuetify.js',
    };
  },
  methods: {
    usernameFormSubmit(e) {
      e.preventDefault();
      if (this.username.trim().length > 0) {
        console.log("username is " + this.username.trim());
        this.users.push({
          userID: this.userID,
          username: this.username.trim()
        });
        this.messages.push({
          id: this.messageID,
          username: "system",
          messageText: this.username.trim() + " has joined.",
          private: false
        });
        this.lastToMessage = "system";
        this.usernameChosen = true;
        this.messagingChat = true;
        this.usernameID++;
        this.messageID++;
        console.log("username id is now " + this.usernameID);
        console.log("message id is now " + this.messageID);
      }
    },
    messageFormSubmit(e) {
      e.preventDefault();
      let bottomButton = document.getElementById("goDown");
      if (this.message.trim().length > 0) {
        this.trimmedMessage = this.message.trim();
        this.message = "";
        this.checkIfTyping();
        console.log(this.username + " said " + this.trimmedMessage);
        this.messages.push({
          id: this.messageID,
          username: this.username,
          messageText: this.trimmedMessage,
          private: false
        });
        this.messageID++;
        this.lastToMessage = this.username;
        console.log("the last to message was " + this.lastToMessage);
        console.log("message id is now " + this.messageID);
        bottomButton.click();
      }
    },
    privateMessageFormSubmit(e) {
      e.preventDefault();
      if (this.privateMessage.trim().length > 0) {
        this.trimmedMessage = this.message.trim();
        this.privateMessage = "";
        console.log(this.username + " said " + this.trimmedMessage + "to ");
        this.messages.push({
          id: this.messageID,
          username: this.username,
          messageText: this.trimmedMessage,
          private: false
        });
        this.messageID++;
        console.log("message id is now " + this.messageID);
      }
    },
    checkIfTyping() {
      if (this.message.trim().length > 0) {
        this.typing = true;
      } else {
        this.typing = false;
      }
    },
    privateMessage(user) {
      this.privateMessageTo = user;
      this.pmPlaceholder = "Private Message to " + user;
      console.log("Private messaging " + user);
      console.log("Finding messages from " + user);
      this.filterPrivateMessagesFrom(this.messages);
      this.messagingUser = true;
      this.messagingChat = false;
    },
    hidePrivateMessagesShowChat() {
      this.messagingUser = false;
      this.messagingChat = true;
      this.showUsers = false;
    },
    filterPrivateMessagesFrom(messages) {
      let lastMessage = document.getElementById("chatMessages").lastChild;
      let tempMessageFolder = [];
      for (i = 0; i < messages.length; i++) {
        if (this.privateMessageTo == messages[i].username) {
          console.log("found a message from " + this.privateMessageTo);
          if (messages[i].private == true) {
            console.log("It was private, let's post it!");
            tempMessageFolder.push(messages[i]);
          }
        }
      }
      this.userPrivateMessages = tempMessageFolder;
    },
    usersTypingFunction() {
      let singleTyper = "";
      let twoTypers = "";
      let multipleTypers = "";
      if (this.usersTyping.length == 1) {
        singleTyper = usersTyping[0] + " is typing.";
        this.usersTypingText = singleTyper;
      } else if (this.usersTyping.length == 2) {
        twoTypers = usersTyping[0] + " and " + usersTyping[1] + " are typing.";
        this.usersTypingText = twoTypers;
      } else if (this.usersTyping.length == 0) {
        this.usersTypingText = "";
      } else {
        for (i = 0; i < usersTyping.length; i++) {
          if (i == usersTyping.length - 1) {
            multipleTypers += "and " + usersTyping[i] + " are typing.";
          } else {
            multipleTypers += usersTyping[i] + ", ";
          }
        }
        this.usersTypingText = multipleTypers;
      }
    }
  },
  mounted() {
    this.socket.on("connect", () => {
      let userID = socket.id;
      socket.emit("hello?", userID);
    });
    socket.on("users typing", usernames => {
      this.usersTyping = usernames;
      this.usersTypingFunction();
    });
  },
  computed: {
    filterChatMessages: function() {
      return this.messages.filter(function(message) {
        return message.private == false;
      });
    },
    filterAllPrivateMessages: function() {
      return this.messages.filter(function(message) {
        return message.private == false;
      });
    }
  },
  watch: {
    typing: function() {
      if (this.typing == false && this.message.trim().length == 0) {
        socket.emit("done typing", this.username);
        console.log(this.username + " has stopped typing");
      }
      if (this.typing == false && this.message.trim().length > 0) {
        socket.emit("typing", this.username);
        console.log(this.username + " is typing.");
      }
      if (this.typing == true && this.message.trim().length > 0) {
        socket.emit("typing", this.username);
        console.log(this.username + " is typing.");
      }
    }
  }
};
</script>
