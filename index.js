Vue.component("navigation-bar", {
    props: {
        name: String
    },
    template: `    
    <!-- Navigation -->
    <div>
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <div class="container">
                <a class="navbar-brand" href="#">{{name}}</a>
                <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbar"
                    aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav mr-auto">
                        <li class="nav-item"><a class="nav-link" href="#">Edit</a></li>
                    </ul>
                </div>
            </div>
        </nav> 
    </div>
    `
})

Vue.component("page-footer", {
    props: {
        name: String
    },
    template: `    
    <div>    
        <hr />
        <footer class="footer">
            <div class="container">
                <span class="text-muted">&copy; 2020 - {{name}}</span>
            </div>
        </footer>
    </div>
    `
})

Vue.component("choices-display", {
    props: {
        keyProp: {type: String},
        parent: {type: String},
		text: {type: String},
		image: {type: String},
        category: {type: Boolean},
        isSelected: {type:Boolean},
    },
    template:
    `    
    <div>
        <!-- Card -->
        <div class="row my-2">
            <div class="col-sm-12">
                <div class="card" :class="{ 'border-dark': isSelected }">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-11" style="transform: rotate(0);">
                                <a href="#" class="stretched-link" v-on:click="selectChoice"></a>
                                {{choiceText}}
                                <span class="float-right badge badge-info" v-if="choiceCategory">
                                    CATEGORY
                                </span>
                            </div>
                            <div class="col-1" v-if="canDelete">
                                <button type="button" class="btn btn-danger btn-sm" v-if="canDelete" data-toggle="modal" data-target="#deleteChoice"><i class="fa fa-trash" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <img class="card-img" src="choice.jpg" alt="Card image cap" height="180">
                </div>
            </div>
        </div>
        
        <!-- Modal Delete -->
        <div class="modal fade" id="deleteChoice" tabindex="-1" role="dialog" aria-labelledby="deleteChoiceLabel"
        aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteChoiceLabel">Delete Choice</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Delete the choice: {{text}}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>                                                        
                        <button type="button" class="btn btn-primary" v-on:click="deleteData" data-dismiss="modal">Delete this Choice</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    created() {        
    },
    data: function () {
        return {
            choiceKey: this.keyProp,
            choiceParent: this.parent,
            choiceText: this.text,
            choiceImage: this.image,   
            choiceCategory: this.category,
        }
    },
    computed: {
       canDelete() {
           return this.choiceKey != "CHC:ROOT";
       },
   },
   methods: {
        selectChoice() {
            this.$emit("select-choice", this.choiceKey)
        },
       deleteData() {
           deleteData(this.choiceKey);           
           this.$emit("add-message",`Deleted choice: ${this.choiceText}`);
           this.$emit("select-choice", this.choiceParent)
       }
   }
})

Vue.component("choices-add", {
    props: {
        parent: {type: String},
        isSelected: {type:Boolean},
    },
    template:
    `    
    <div>
        <!-- Add "Button" -->
        <button v-if="!isSelected" type="button" class="btn btn-success float-right" data-toggle="modal" data-target="#addChoice">Add New Choice</button>       
        
        <!-- Modal Save -->
        <div class="modal fade" id="addChoice" tabindex="-1" role="dialog" aria-labelledby="addNewChoiceLabel"
        aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addNewChoiceLabel">Add New Choice</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Choice Text
                                <input type="text" class="form-control" v-model="addText">
                                <small class="form-text text-muted">The text that describes your choice</small>
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Choice Image URL
                                <input type="url" class="form-control" v-model="addImage">
                                <small class="form-text text-muted">An image URL for your choice</small>
                            </label>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" class="form-check-input" v-model="checked">
                                Category
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>                                                        
                        <button type="button" class="btn btn-primary" v-on:click="saveData" data-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function () {
        return {
            addKey: "",
            addText: "",
            addImage: "",
            checked: false
        }
    },
    computed: {
        addCategory() {
           return this.checked;
       },
   },
   methods: {
        saveData() {
            data = {
                parent: this.parent,
                text: this.addText,
                image: this.addImage,
                category: this.addCategory
            };
            saveData(this.addKey, data);
            this.$emit("add-message",`${this.addText} choice successfully saved`);
            // clean-up
            this.addText = "";
            this.addImage = "";
            this.checked = false;
            // refresh
            this.$emit("select-choice", this.parent)
       }
   }
})

// Vue App
var app = new Vue({
    el: '#app',
     data: function () {
        return {
            rootKey: "CHC:ROOT",
            appList:[],
            messages: [],
            parent: this.rootKey,
            text: "",
            category: false,
            selected: false,
        }
    },
    created() {
        setRootData(this.rootKey);
        this.selectChoice(this.rootKey);  
    },
    mounted() {
    },
    computed: {
        atRoot() {
            return this.parent === this.rootKey;
        },
        haveMessages() {
            return this.messages.length > 0;
        },    
        displayText() {
            return this.category && !this.atRoot;
        }       
    },    
    methods: {
        goBack() {
            if (this.parent !== this.rootKey) {
                let data = getData(this.parent);
                if (data !== undefined || data !== null) {
                    if (data.parent !== undefined || data.parent !== null || data.parent !== "") 
                        this.selectChoice(data.parent);
                    else 
                        this.goRoot();
                }
                else
                    this.goRoot();
            }
        },
        selectChoice(choiceKey) {
            this.selected = false;

            let data = getData(choiceKey);
            if (data !== undefined && data !== null) {

                this.category = data.category;
                this.text = data.text;

                let list = listData(choiceKey);
                if (list && list.length)
                    this.appList = list;   
                else {
                    if (data.category)
                        this.appList = [];
                    else {
                        this.appList = [{key: choiceKey, data: data}];
                        this.selected = true;
                    }
                }
                this.parent = choiceKey;
            }
        },
        addMessage(messageText, messageType) {
            this.messages.push({ text: messageText, alertClass: getAlertClass(messageType) });            
            this.timer = setTimeout(this.clearMessages, 3000);
        },
        clearMessages() {
            for (i = 0; i < this.messages.length; i++) {
                if (this.messages.alertClass !== "danger")
                    this.messages.splice(i, 1);
            }
        },           
    }
});

// JavaScript Functions

/**
 * Sets the Choices root data
 * 
 * @param {string} rootKey 
 */
function setRootData(rootKey) {
    let data = getData(rootKey);
    if (data === undefined || data === null) {
        data = {
            parent: "",
            text: "Choices",
            image: "",
            category: true
        };
        saveData(rootKey, data);
    }
}

/**
 * Returns Choices data as a list
 * 
 * @param {string} choiceKey
 * @return {Array} key data objects
 */
function listData(choiceKey) {
    var list = [];

    Object.keys(localStorage).forEach(function (key) {
        if (key.startsWith("CHC:")) {
            let data = JSON.parse(localStorage.getItem(key));
            if (data.parent === choiceKey) {                
                let item = {
                    key: key, data: data
                }
                list.push(item);
            }            
        }
    });
    return list;
}

/**
 * Generates a GUID
 * 
 * @return {string} GUID
 */
function getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Saves data to local storage, returns the key the data was saved against
 * 
 * @param {string} key 
 * @param {object} data 
 * @return {string} key
 */
function saveData(key, data) {
    if (key == "")
        key = "CHC:" + getGuid();
    window.localStorage.setItem(key, JSON.stringify(data));
    return key;
}

/**
 * Returns the data from local storage that is associated with the key
 * 
 * @param {string} key 
 * @return {object} key data
 */
function getData(key) {    
    return JSON.parse(window.localStorage.getItem(key));
}

/**
 * Deletes the data in local storage that is associated with the key
 * 
 * @param {string} key 
 */
function deleteData(key) {
    window.localStorage.removeItem(key);
}

/**
 * Match a passed Object's Properties against a passed in RegExp
 * @param {Object} object 
 * @param {RegExp} filterRegEx 
 * @return {Boolean} if there is a match
 */
function matchObjectProperties(object, filterRegEx) {
    for (const property in object) {
        if (object[property].match(filterRegEx))
            return true;
    }        
    return false;
}

/**
 * Returns a Bootstrap alert class for a message type
 * 
 * @param {string} messageType 
 * @return {string} Bootstrap alert class
 */
function getAlertClass(messageType) {

    var alertClass = 'alert';
    if (messageType == "info")
        alertClass += ' alert-info';
    else if (messageType == "warning")
        alertClass += ' alert-warning';
    else if (messageType == "danger")
        alertClass += ' alert-danger';
    else
        alertClass += ' alert-success';
    alertClass += ' alert-dismissible hide alerts-fade-in';

    return alertClass;
}
