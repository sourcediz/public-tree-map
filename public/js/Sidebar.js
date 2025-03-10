var app = this.app || {};
var a2a_config = a2a_config || {};
a2a_config.templates = a2a_config.templates || {};
var images = [];
var indexOfImages = 1;

var initialY = null;


(function(module) {

  function Sidebar() {
    this.body                   = document.getElementsByTagName('body')[0];
    this.sidebar                = document.getElementById('sidebar');
    this.defaultScreen          = document.getElementById('sidebar-default');
    this.exploreMapButton       = document.getElementById('sidebar-default-explore')
    this.treeContainer          = document.getElementById('sidebar-tree');
    this.errorScreen            = document.getElementById('sidebar-error');
    this.image                  = document.getElementById('sidebar-image');
    this.imageCreditLink        = document.getElementById('sidebar-image-credit-link');
    this.commonName             = document.getElementById('sidebar-common-name');
    this.botanicalName          = document.getElementById('sidebar-botanical-name');
    this.treeId                 = document.getElementById('sidebar-tree-id');
    this.nativity               = document.getElementById('sidebar-nativity');
    this.height                 = document.getElementById('sidebar-height');
    this.diameter               = document.getElementById('sidebar-diameter');
    this.shadeProduction        = document.getElementById('sidebar-shade-production');
    this.irrigationRequirements = document.getElementById('sidebar-irrigation-requirements');
    this.type                   = document.getElementById('sidebar-type');
    this.iucnStatus             = document.getElementById('sidebar-iucn-status');
    this.ipcRating              = document.getElementById('sidebar-ipc-rating');
    this.treeFamily             = document.getElementById('sidebar-tree-family');
    this.treeFamilyCommon       = document.getElementById('sidebar-tree-family-common');
    this.pruningYear            = document.getElementById('sidebar-pruning-year');
    this.pruningZone            = document.getElementById('sidebar-pruning-zone');
    this.replacementSpecies     = document.getElementById('sidebar-replacement-species');
    this.address                = document.getElementById('sidebar-address');
    this.streetSegment          = document.getElementById('sidebar-street-segment');
    this.treeDetails            = document.getElementById('sidebar-tree-details');
    this.closeButton            = document.getElementById('sidebar-close-button');
    this.detailsButton          = document.getElementById('sidebar-details-button');

    // Vacant panel elements
    this.vacantContainer          = document.getElementById('sidebar-vacant');
    this.vacantCommonName         = document.getElementById('sidebar-vacant-common-name');
    this.vacantTreeId             = document.getElementById('sidebar-vacant-tree-id');
    this.vacantAddress            = document.getElementById('sidebar-vacant-address');
    this.vacantPruningYear        = document.getElementById('sidebar-vacant-pruning-year');
    this.vacantReplacementSpecies = document.getElementById('sidebar-vacant-replacement-species');
    this.vacantStreetSegment      = document.getElementById('sidebar-vacant-street-segment');
    this.vacantCloseButton        = document.getElementById('sidebar-vacant-close-button');
    this.vacantDetailsButton      = document.getElementById('sidebar-vacant-details-button')

    this.closeButton.onclick = closePanel.bind(this);
    this.vacantCloseButton.onclick = closePanel.bind(this);

    // Buttons for mobile view
    this.detailsButton.onclick = toggleFullMobileView.bind(this);
    this.vacantDetailsButton.onclick = toggleFullMobileView.bind(this);
    this.exploreMapButton.onclick = toggleFullMobileView.bind(this);
    
    this.sidebar.addEventListener("touchstart", startTouch, false);
    this.sidebar.addEventListener("touchmove", onSwipe, false)


    onSwipe
  }

  Sidebar.prototype.setTree = function(tree) {
    if (!tree) {
      return this.showDefault();
    }
    const VACANCIES = [
      'vacant site',
      'stump',
      'asphalted well',
      'unsuitable site',
      'stump - not accessible',
    ];
    if (VACANCIES.indexOf(tree.name_botanical.toLowerCase()) !== -1) {
      this.vacantContainer.classList.remove('hidden');
      this.defaultScreen.classList.add('hidden');
      this.treeContainer.classList.add('hidden');
      this.errorScreen.classList.add('hidden');
      this.populateVacanciesPanel(tree);
    } else {
      this.vacantContainer.classList.add('hidden');
      this.treeContainer.classList.remove('hidden');
      this.defaultScreen.classList.add('hidden');
      this.errorScreen.classList.add('hidden');
      this.populateTreePanel(tree);
      this.populateTreeSharePanel(tree);
    }
  }

  Sidebar.prototype.populateVacanciesPanel = function(tree) {
    this.vacantCommonName.innerText         = tree.name_common;
    this.vacantTreeId.innerText             = tree.tree_id;
    this.vacantAddress.innerText            = tree.address;
    this.vacantPruningYear.innerText        = tree.pruning_year;
    this.vacantReplacementSpecies.innerHTML = `<em>${tree.replacement_species}</em>`;
    this.vacantStreetSegment.innerText      = tree.segment;
  }

  Sidebar.prototype.populateTreePanel = function(tree) {
    this.commonName.innerText             = tree.name_common;
    this.botanicalName.innerText          = tree.name_botanical;
    this.treeId.innerText                 = tree.tree_id;
    this.nativity.innerText               = buildNativityText(tree.nativity);
    this.height.innerText                 = buildHeightText(tree.height_min_ft, tree.height_max_ft);
    this.diameter.innerText               = buildDiameterText(tree.diameter_min_in, tree.diameter_max_in);
    this.shadeProduction.innerText        = tree.shade_production;
    this.irrigationRequirements.innerText = tree.irrigation_requirements;
    this.iucnStatus.innerText             = tree.iucn_status;
    this.ipcRating.innerText              = buildIpcText(tree.ipc_rating);
    this.treeFamily.innerHTML             = `${tree.family_name_common} (<em>${tree.family_name_botanical}</em>)`;
    this.pruningYear.innerText            = tree.pruning_year;
    this.replacementSpecies.innerHTML     = `<em>${tree.replacement_species}</em>`;
    this.address.innerText                = tree.address;
    this.streetSegment.innerText          = tree.segment;

    if (tree.images && tree.images.length > 0) {
      this.image.style.backgroundImage = 'url(' + tree.images[1].url + ')';
      this.image.style.backgroundSize = 'cover';
      this.image.classList.remove('hidden');

      this.imageCreditLink.href = tree.images[1].author.url;
      images = tree.images;
    } else {
      this.image.style.backgroundImage = '';
      this.image.classList.add('hidden');
    }
  }

  Sidebar.prototype.showDefault = function() {
    this.errorScreen.classList.add('hidden');
    this.treeContainer.classList.add('hidden');
    this.vacantContainer.classList.add('hidden');
    this.defaultScreen.classList.remove('hidden');
    removeQueryStringFromUrlBar();
  }

  Sidebar.prototype.showError = function() {
    this.defaultScreen.classList.add('hidden');
    this.treeContainer.classList.add('hidden');
    this.vacantContainer.classList.add('hidden');
    this.errorScreen.classList.remove('hidden');
  }

  Sidebar.prototype.populateTreeSharePanel = function(tree) {
    let treeName = tree.name_common;
    a2a_config.templates.email = {
      subject: treeName+" on Santa Monica's Public Tree Map",
      body: treeName+" on Santa Monica's Public Tree Map :\n${link}"
    };

    a2a_config.templates.twitter = {
        text: treeName+" on Santa Monica's ${title} ${link} @santamonicacity",
    };
  }
  Sidebar.prototype.closeSidebar = function(){
    let fullScreen = 'sidebar-mobile--fullscreen';
    let closed = 'sidebar-mobile--closed'
    if(this.body.classList.contains(fullScreen)) {
      (toggleFullMobileView.bind(this))();
    }
    else {
      this.body.classList.add(closed);
      this.showDefault();
      
    }
  }

  function buildNativityText(nativity) {
    if ("native" === nativity.toLowerCase()) {
      return "This tree is native to California";
    } else if ("exotic" === nativity.toLowerCase()) {
      return "This tree isn't native to California";
    } else if ("moderate" === nativity.toLowerCase()) {
      return "This tree isn't native to California";
    } else if ("watch" === nativity.toLowerCase()) {
      return "This tree isn't native to California";
    } else if ("limited" === nativity.toLowerCase()) {
      return "This tree isn't native to California";
    } else {
      return "Unknown";
    }
  }
  function toggleFullMobileView() {
    let className = 'sidebar-mobile--fullscreen';
    if(this.body.classList.contains(className)) {
      this.body.classList.remove(className);
      this.detailsButton.classList.remove('hidden');
      this.vacantDetailsButton.classList.remove('hidden');
      this.detailsButton.innerText = "View Details";
      this.vacantDetailsButton.innerText = "View Details";
      this.exploreMapButton.innerText = "What is Public Tree Map?";
    }
    else {
      this.body.classList.add(className);
      this.detailsButton.classList.add('hidden');
      this.vacantDetailsButton.classList.add('hidden');
      this.exploreMapButton.innerText = "Explore the Map";
    }
  }

  

  function startTouch(e){
      initialY = e.touches[0].clientX;
  }
  function onSwipe(e) {
    if (initialY === null) {
      return;
    }
   
    var currentY = e.touches[0].clientY;
   
    var diffY = initialY - currentY;
   
    
    if (diffY > 0) {
      // swiped up
      console.log("swiped up");
      toggleFullMobileView();

    } else {
      // swiped down
      console.log("swiped down");
      closePanel();
    }  
    
   
    initialY = null;
  } 


  function closePanel() {
    let fullScreen = 'sidebar-mobile--fullscreen';
    let closed = 'sidebar-mobile--closed'
    if(this.body.classList.contains(fullScreen)) {
      (toggleFullMobileView.bind(this))();
    }
    else {
      this.body.classList.add(closed);
      this.showDefault();
      
    }
  }

  function buildNativityText(nativity) {
    if ("native" === nativity.toLowerCase()) {
      return "This tree is native to California";
    } else if ("exotic" === nativity.toLowerCase()) {
      return "This tree isn't native to California";
    } else if ("moderate" === nativity.toLowerCase()) {
      return "This tree isn't native to California";
    } else if ("watch" === nativity.toLowerCase()) {
      return "This tree isn't native to California";
    } else if ("limited" === nativity.toLowerCase()) {
      return "This tree isn't native to California";
    } else {
      return "Unknown";
    }
  }

  function buildHeightText(min, max) {
    if (min === -1 && max === -1) {
      return "Unknown";
    }
    if (min === -1) {
      return "Up to " + max + ' feet'
    }
    if (max === -1) {
      return min + '+ feet';
    }
    return min + "-" + max + " feet";
  }

  function buildDiameterText(min, max) {
    if (min === -1) {
      return "Unknown";
    }
    if (min === -1) {
      return "Up to " + max + ' inches'
    }
    if (max === -1) {
      return min + '+ inches';
    }
    return min + "-" + max + " inches";
  }

  function buildIpcText(ipcRating){
    if (ipcRating === "moderate") {
      return "moderate";
    }
    if (ipcRating === "watch") {
      return "watch";
    }
    if (ipcRating === "limited") {
      return "limited";
    } else {
      return "not listed";
    }

  }

  function removeQueryStringFromUrlBar() {
    var newURL = location.href.split("?")[0];
    window.history.pushState('object', document.title, newURL);
  }

  // Exports
  module.Sidebar = Sidebar;

})(app);

function currentSlide(index){
  this.image = document.getElementById('sidebar-image');
  this.imageCreditLink = document.getElementById('sidebar-image-credit-link');
  this.image.style.backgroundImage = 'url(' + images[index].url + ')';
  this.imageCreditLink.href = images[index].author.url;
}

function lastSlideImage(){
  if(indexOfImages==0){
    indexOfImages=2;
    currentSlide(indexOfImages);
  }else{
    indexOfImages-=1;
    currentSlide(indexOfImages);
  }
}
function nextSlideImage(){
  if(indexOfImages==2){
    indexOfImages=0;
    currentSlide(indexOfImages);
  }else{
    indexOfImages+=1;
    currentSlide(indexOfImages);
  }
}
