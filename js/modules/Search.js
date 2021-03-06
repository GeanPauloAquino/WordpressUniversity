import $ from 'jquery';
class Search{
    constructor(){
       this.openButton=$(".js-search-trigger");
       this.closeButton=$(".search-overlay__close");
       this.searchOverlay=$(".search-overlay");
       this.searchField = $("#search-term");
       this.resultsDiv =$("#search-overlay__results");
       this.events();
       this.SpinnerVisible = false;
       this.previousValue;
       this.typingTimer;
    }

    events(){
        this.openButton.on("click", this.openOverlay.bind(this));
        this.closeButton.on("click",this.closeOverlay.bind(this));
        $(document).on("keydown",this.keyPressDispatcher.bind(this)); 
        this.searchField.on("keyup",this.typingLogic.bind(this));
    }
    typingLogic(){
        if(this.searchField.val()!= this.previousValue){
            clearTimeout(this.typingTimer);
            if(this.searchField.val()){
                if(!this.SpinnerVisible){
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                        this.SpinnerVisible=true;
                    }
                    this.typingTimer =setTimeout(this.getResults.bind(this),750);        
            }
            else{
            this.resultsDiv.html(''); 
            this.SpinnerVisible = false;
            }
          
        }
      
        this.previousValue = this.searchField.val();
    }
    getResults(){
        $.when(
            $.getJSON(universityData.root_url +'/wp-json/wp/v2/posts/?search='+ this.searchField.val()),
            $.getJSON(universityData.root_url +'/wp-json/wp/v2/pages/?search='+ this.searchField.val())
        ).then((posts ,pages) => {
            var combinedResults = posts[0].concat(pages[0]);
            this.resultsDiv.html(`
        <h2 class="search-overlay__section-title"> General Information </h2>
         ${combinedResults.length ?   '<ul class ="link-list min-list">' : '<p>No general information</p>'}
                ${combinedResults.map(item=>`<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
        ${combinedResults.length ?   '</ul>' : ''}
        `);
        this.SpinnerVisible=false;
        });
    }
    keyPressDispatcher(e){
       if(e.keyCode==83 && !$("input, textarea").is(':focus')){
           this.openOverlay();
       } 
       if(e.keyCode==27){
        this.closeOverlay();
    } 
    }
    openOverlay(){
        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass("body-no-scroll");
        this.searchField.val('');
        setTimeout(()=> this.searchField.focus(),301);
    
    }
    closeOverlay(){
        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");
    }

}
export default Search;