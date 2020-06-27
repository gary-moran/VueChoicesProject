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
		category: {type: Boolean}		
    },
    template:
    `
	<div class="card">
	    <div class="card-header">
            {{choiceText}}
			<span class="float-right badge badge-info" v-if="choiceCategory">
				CATEGORY
			</span>
        </div>
		<div class="card-body">
			<button class="btn btn-success">Add</button>
			<button class="btn btn-danger">Delete</button>				
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
            choiceCategory: this.category         
        }
    },
    computed: {
    },
    methods: {
    }
})

Vue.component("choices-add", {
    props: {
        keyProp: {type: String, default: ""},
        parent: {type: String, default: ""}
    },
    template:
    `
    <form>
        <div class="form-group">
            <label>Choice Text
                <input type="text" class="form-control" v-model="choiceText">
                <small class="form-text text-muted">The text that describes your choice</small>
            </label>					
        </div>
        <div class="form-group">
            <label>Choice Image URL
                <input type="url" class="form-control" v-model="choiceImage">
                <small class="form-text text-muted">An image URL for your choice</small>
            </label>
        </div>
        <div class="form-check">
            <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="checked">
                Category						
            </label>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
    </form>
    `,
    created() {        
    },
    data: function () {
        return {
            choiceKey: this.keyProp,
            choiceParent: this.parent,
            choiceText: "",
            choiceImage: "",
            checked: false
        }
    },
    computed: {
         choiceCategory() {
            return this.checked;
        }
    },
    methods: {
         saveData() {
            data = {
                parent: this.choiceParent,
                text: this.choiceText,
                image: this.choiceImage,
                category: this.choiceCategory
            };
            this.choicekey = saveData(this.choiceKey, data);
            //this.addMessage(`${this.choiceText} choice successfully saved`);
        },
        deleteData() {
            var letName = this.$refs.Name.inputData;
            deleteData(this.$refs.Id.inputData);
            this.newData();
            //this.addMessage(`Deleted choice: ${this.choiceText}`);
        }
    }
})

// Vue App
var app = new Vue({
    el: '#app',
     data: function () {
        return {
            appList: []
        }
    },
    created() {
        let key = "CHC:ROOT";
        data = getRootData(key);
        this.appList = [ { key: key, data: data } ]
    },
    methods: {
    }
});

// JavaScript Functions

/**
 * Returns the Choices root data
 * 
 * @param {string} rootKey 
 * @return {object} key data
 */
function getRootData(rootKey) {
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
    return data;
}

/**
 * Returns Choices data as a list
 * 
 * @return {Array} key data objects
 */
function listData() {
    var list = [];
    Object.keys(localStorage).forEach(function (key) {
        if (key.startsWith("CHC:")) {
            let data = JSON.parse(localStorage.getItem(key));
            let item = {
                key: key, text: data.text, image: data.image, checked: data.checked
            }
            list.push(item);
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
