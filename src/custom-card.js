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