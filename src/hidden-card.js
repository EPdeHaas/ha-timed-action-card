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