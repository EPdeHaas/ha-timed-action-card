
/***[ Serious Build ]******************************************************************
 * @name         Timed Action Card
 * @author       Serious Hare
 * @version      0.0.1  [publish]
 * @date         15-06-22 22:39:53
 * @description
 *  A hidden card that triggers an actions after a given timeout has elapsed.
 **************************************************************************************/

const _APP = {name: "Timed Action Card",author: "Serious Hare",version: "0.0.1  [publish]",build_date: "15-06-22 22:39:53",};

/***[ Serious Build ]******************************************************************
 * @file custom-card.js
 **************************************************************************************/

/**
 * @class CustomCard
 * @extends HTMLElement
 * @description
 *   This class acts as the base for custom cards.
 */
class CustomCard extends HTMLElement{

    // Stores whether editMode is enabled
    #editMode;


    /**
     * @constructor
     * @description
     *   Constructor for the CustomCard class.
     */
    constructor(){
        super();

        console.log(this);

        this.attachShadow({mode: 'open'});
    }


    /**
     * @method setConfig
     * @description
     *   Parses the profided config, and collects the used variables. Then stores the
     *   config in this._config.
     */
    setConfig(config){
        this._config = JSON.parse(JSON.stringify(config));

        return this._config;
    }


    /**
     * @property {Boolean} editMode
     * @description
     *   Gets or sets the editMode property.
     */
    get editMode(){
        if(this.#editMode) return true;
        if(window.location.search.match(/(\?|\&)edit=1/)) return true;
    }
    set editMode(value){
        this.#editMode = value;
    }
}


/***[ Serious Build ]******************************************************************
 * @file hidden-card.js
 **************************************************************************************/

/**
 * @class HiddenCard
 * @extends CustomCard
 * @description
 *  This class acts as the base for hidden custom cards. These are cards that
 *  provide frontend features that don't require a visible elements.
 * 
 */
class HiddenCard extends CustomCard{

    // Stores the descriptive name of the card.
    #typeName;


    /**
     * @constructor
     * @description
     *  Constructor for the HiddenCard class.
     * @param {String} typeName  Descriptive name for the hidden card.
     */
    constructor(typeName = `Hidden Card`){
        super();

        this.#typeName = typeName;
    }


    /**
     * @method connectedCallback
     *  Builds up the cards HTML when the card is placed on the deshboard.
     */
    connectedCallback(){
        let html  = `<hr /><h3>${this.#typeName}</h3>\n`;

        this.shadowRoot.innerHTML = html;
    }


    /**
     * @property {Boolean} editMode
     * @overloads
     * @description
     *   Makes the card info visible when the dashboard is in edit mode.
     */
    get editMode(){
        return super.editMode;
    }
    set editMode(value){
        this.style.display = value? `unset` : `none`;
        super.editMode = value;
    }
}


/***[ Serious Build ]******************************************************************
 * @file timed-action-card.js
 **************************************************************************************/

/**
 * @class TimedActionCard
 * @extends HiddenCard
 * @card_tag <timed-action-card>
 */
class TimedActionCard extends HiddenCard{

    #timeout;   // Stores a reference to the timeout.
    #listener;  // Stores a reference to the onclick listener


    /**
     * @constructor
     * @description
     *   Initializes the class instance.
     */
    constructor(){
        super("Timed Action Card");

        this.#listener = (e) => {this.onWindowClicked(e)};
    }


    /**
     * @method connectedCallback
     * @description
     *  This method is called when the card has been added to the DOM. This happens each
     *  time the view containing the card becomes visible, and can therefor be used to
     *  start the timeout.
     */
    connectedCallback(){
        super.connectedCallback();

        // Return if the dashboard is in edit mode. Prevents the timer to get set.
        if(this.editMode) return;

        // Clear any old timeout.
        clearTimeout(this.#timeout);

        // Create a new timeout that will trigger the `handleAction` method.
        this.#timeout = setTimeout(() => this.handleAction(), this._config.timeout * 1000);

        window.addEventListener("click", this.#listener);
        window.addEventListener("touchstart", this.#listener);
    }


    /**
     * @method disconnectedCallback
     * @description
     *  This method is called when the card has been removed from the DOM. This happens
     *  each time the view containing the card becomes hidden. Here we have to clear any
     *  remaining timeout.
     */
    disconnectedCallback(){
        // Clear any old timeout.
        clearTimeout(this.#timeout);

        window.removeEventListener("click", this.#listener);
        window.removeEventListener("touchstart", this.#listener);
    }


    onWindowClicked(mouseEventArgs){
        console.warn("CLICK");
        // Clear any old timeout
        clearTimeout(this.#timeout);

        // Create a new timeout that will trigger the `handleAction` method
        this.#timeout = setTimeout(() => this.handleAction(), this._config.timeout * 1000);
    }


    /**
     * @method setConfig
     * @description
     *  Initialze the yaml configuration of the card.
     * @param {Object} config
     */
    setConfig(config) {
        config = super.setConfig(config);

        // Check for some required config properties.
        if(!config.action) config.action = 'navigate';

        // Some more checks, based on the defined action.
        switch(config.action){
            case 'navigate':
                // Initialize the config for a navigation action.
                config = Object.assign(TimedActionCard.defaults.navigate, config);
                break;
            case 'call-service':
                if(!config.service) throw new Error("No 'service' geiven for the Call Service action.");

                config = Object.assign(TimedActionCard.defaults.call_service, config);
                break;
            default:
                // Throw an error if an unsupported action is set within the config.
                throw new Error("The action '" + config.action + "' is not supported.");
        }
    }


    /**
     * @method handleAction
     * @description
     *  Checks what action was set in the cards config, and triggers that action.
     * @note Only supports entity-id(s) as target.
     */
    handleAction(){
        let config = this._config;

        switch(config.action){
            case 'navigate':
                let path = config.navigation_path;
                console.warn(path);
                this.navigate(path);
                break;
            case 'call-service':
                let domain       = config.service.split(".")[0];
                let service      = config.service.split(".")[1];
                let service_data = config.service_data;
                let entity_ids   = this.getEntityIDs(config.target);

                for(let entity_id of entity_ids){
                    console.warn(domain, service, entity_id, service_data);
                    this.callService(domain, service, entity_id, service_data);
                }
                break;
            default:
                throw new Error("Trying to execute a unsupported action.");
        }
    }


    /**
     * @method navigate
     * @description
     *  This method navigates to another view/dashboard
     * @param {String}  path     The path to navigate to.
     * @param {Boolean} replace  Replace the current history state or not.
     * @default false
     * @optional
     */
    navigate(path, replace = false){
        if(replace){
            window.history.replaceState(null, "", path);
        }else{
            window.history.pushState(null, "", path);
        }
        this.fireEvent(window, "location-changed", {
            replace
        })
    }


    /**
     * @method fireEvent
     * @description
     *  This method raises an event on the given node, containing the provided details.
     * @param {Node}   node    The node on which the event should be raised.
     * @param {String} type    The type of event to raise.
     * @param {Object} detail  Object containing the details used with the event.
     * @returns {Event}  The raised event.
     */
    fireEvent(node, type, detail){
        detail = detail === null || detail === undefined ? {} : detail;
        let event = new Event(type, {
            bubbles: true,
            cancelable: false,
            composed: true
        });
        event.detail = detail;
        node.dispatchEvent(event);
        return event;
    }


    /**
     * @method callService
     *  This method calls the given service.
     * @param {String} domain     The domain on which to call the service.
     * @param {String} service    The service to call.
     * @param {String} entityId   ID of the entity for which to call the service.
     * @param {Object} inOptions  Service data for the call.
     */
    callService(domain, service, entityId, inOptions){
        this.hass.callService(domain, service, {
            entity_id: entityId,
            ...inOptions
        });
    }


    /**
     * @method getEntityIDs
     * @description
     *  Turns the different targets into a single list of entity_ids.
     * @param {Object} target  The target property of the cards config
     * @return {Array}         An array containging a list of id's for all targeted
     *                         entities.
     */
    getEntityIDs(target){
        // create an entity_ids variable as return value.
        let entity_ids = [];

        // if there's only 1 entity_id within the `target` object push it directly to
        // the `entity_ids` array, otherwise add each entity_id.
        if(typeof target.entity_id === "string"){
            entity_ids.push(target.entity_id);
        }else if(target.entity_id instanceof Array){
            for(let entity_id of target.entity_id){
                entity_ids.push(entity_id);
            }
        }

        // return the new entity_ids array.
        return entity_ids;
    }


    /**
     * @static @readonly @property {Object} defaults
     * @description
     *  Returns an Object containing the default config for the card.
     */
    static get defaults(){
        return {
            // Default config for navigate actions
            navigate: {
                timeout: 10,
                action: 'navigate',
                navigation_path: 'default_view'
            },
            // Default config for call service actions
            call_service: {
                timeout: 10,
                action: 'call-service',
                service: null,
                service_data: {},
                target: {}
            }
        }
    }
}
customElements.define('timed-action-card', TimedActionCard);

