// IIFE - Immediately Invoked Function Expression
(function() {
  "use strict";

  // setting up form reference
  const ghostForm = document.querySelector('.create-form');
  let allGhosts = [];

  // local storage as a namespace
  const storage = {
    set() {
      // localStorage.setItem('property name', value)
      // can look at local storage in dev tools under Application tab
      localStorage.setItem('ghosts', JSON.stringify(allGhosts));
    },
    get() {
      return JSON.parse(localStorage.ghosts);
    },
    clear() {
      localStorage.removeItem('ghosts');
    }
  }

  // ghostCreatorModule REVEALING MODULE PATTERN -
  // wrapped in an IIFE so that it immediately executes and allows the call in the ghostForm event handler
  const ghostCreatorModule = (function() {
    const container = document.querySelector('.all-ghosts-container');
    // Ghost Class
    class Ghost {
      // adds properties to each new instance of a Ghost
      // using ES6 syntax to set default values for primary and secondary
      constructor(name, color, primary = 'float', secondary = 'float') {
        this.name = name;
        this.color = color;
        this.primary = primary;
        this.secondary = secondary;
        this.init();
      }

      addListeners() {
        //adds method to prototype that adds click event listeners
        this.regions.ghost.addEventListener('click', () => {
          this.regions.ghost.classList.add(this.secondary);
        }); // adds animation
        this.regions.ghost.addEventListener('animationend', () => {
          this.regions.ghost.classList.remove(this.primary, this.secondary);
        }); // removes animation on animation end
      }

      // creates document elements to display Ghost on page
      build() {
        //hold references to elements we are creating
        const ghostContainer = document.createElement('div');
        const ghost = document.createElement('div');
        const info = document.createElement('p');

        // adding classes and content
        ghostContainer.className = `ghost-container ${this.name.toLowerCase()}`;
        ghost.className = 'ghost';
        ghost.style.backgroundColor = this.color;
        info.textContent = this.name;

        // appending elements to page.  be careful of the order!
        ghostContainer.appendChild(ghost);
        ghostContainer.appendChild(info);
        container.appendChild(ghostContainer); // container defined just inside ghostCreatorModule

        // holds element references in an object for later access
        return {
          container: ghostContainer,
          ghost: ghost,
          info: info
        };
      }

      // adds the primaryAction animation class
      primaryAction() {
        this.regions.ghost.classList.add(this.primary);
      }

      init() {
        // creates a new property, this.regions, which runs this.build() and assumes the returned object value from this.build()
        this.regions = this.build();
        this.addListeners();
        this.primaryAction();
      }
    }

    // create a new Ghost instance
    function createGhostInstance(context) {
      toggleEmptyContainer();
      allGhosts.push(context);
      storage.set();
      new Ghost(context.name, context.color, context.primary, context.secondary);
    }

    // removes the empty container when there are ghosts present
    function toggleEmptyContainer() {
      const emptyConatiner = document.querySelector('.empty-container');
      if (!emptyConatiner.classList.contains('is-hidden')) {
        emptyConatiner.classList.add('is-hidden');
      }
    }

    // revealing/aliasing the createGhostInstance function for external access
    // by returning an object with a build property that holds ghostCreatorModule.createGhostInstance()
    // sets ghostCreatorModule to have the value of the returned object when executed
    return {
      create: createGhostInstance // no parentheses because we don't want to run it, just store its value
    };
  })();
  // If you don't want to wrap in an IIFE
  // const ghostCreator = ghostCreatorModule(); // sets a variable to store the object returned by the executed ghostCreatorModule function.  You would then call ghostCreator.create();

  // collecting input data from form
  // later used to define the context constant in the ghostForm submit event handler
  function getFormValues(fields) {
    const valuesObj = {
      name: fields[0].value,
      color: fields[1].value,
      primary: fields[2].value,
      secondary: fields[3].value
    };
    // the function returns the value of valuesObj
    return valuesObj;
  }

  // setting up listener for form submit
  ghostForm.addEventListener('submit', () => {
    event.preventDefault();

    // passing in form.create-form element which has the input values stored in an array
    // stores the returned valuesObj in the context constant
    const context = getFormValues(event.target);

    // passing the context constant through the ghostCreatorModule.createGhostInstance() function
    ghostCreatorModule.create(context); // ghostCreatorModule's function value is wrapped in an IIFE, so it is executed when called

    // resetting ghostForm on submit
    ghostForm.reset();
  });

})();


















/*
  Namespace - JavaScript is designed in such a way that it is very easy
  to create global variables that have the potential to interact in negative ways.

  The practice of namespacing is usually to create an object literal encapsulating
  your own functions and variables, so as not to collide with those created by other libraries.
  Namespaces keeps like functionality and information together.

  They differ from classes in that you don't create instances of namespaces.
*/
// const team = {
//   players: 12,
//   mascot: 'Hugo Hornet',
//   city: 'Charlotte',
//   teamName: 'Hornets',
//
//   chant() {
//     console.log(`Here we go ${this.teamName}. Here we go. Oh! Oh!`);
//   }
// }
//
// console.log(team.chant());


// const utils = {
//   strings: {
//     findLongestWord(words) {
//       // Functionality
//     },
//     findShortesWord() {
//       // Functionality
//     }
//   },
//
//   arrays: {
//     push() {
//       // Functionality
//     },
//     removeItem() {
//       // Functionality
//     }
//   },
//
//   addEvent(element, theEvent, callback) {
//     // logic
//   }
// };
//
// utils.strings.findLongestWord(words);
// utils.addEvent('.btn', 'click', function() {
//   console.log('in');
// });


/*
  Module Patterns
*/
// // Immediately Invoked Function Expression - most common module pattern is the IIFE
// // anything created inside will only be visible to functions and methods inside
// (function() {
//
// })();
//
// // Global Import Module - allows to alleviate for naming conflicts.
// // Example below is passing jq in as reference to jquery instead of $.
// // More prevelant where code base is larger and many people are working on the same thing.
// (function(w, d, j) {
//   j('.container').html('Test');
//   d.querySelector('.container');
// })(window, document, jquery);
//
// // Revealing Module Pattern - Allows you to create a module inside an IIFE that is built
// // in a way that its information can be accessed outside the module.
// const whoDat = (function() {
//
//   // Closures are functions that refer to independent (free) variables (variables that are used locally, but defined in an enclosing scope). In other words, these functions 'remember' the environment in which they were created.
//   function playGame() {
//     console.log('Hornets probably lost.');
//   }
//
//   function complainToTheRefs() {
//     console.log('Wahhhhhh. He fouled me!');
//   }
//
//   // we return an object when the module exectues,
//   // allowing us to provide aliases that store our module values
//   // and can be accessed externally
//   return {
//     play: playGame,
//     complain: complainToTheRefs
//   }
// })();
// whoDat.play();
// whoDat.complain();
//
// Revealing Module Pattern Second Example
// const math = (function() {
//   function add(num1, num2) {
//     console.log(num1 + num2);
//   }
//   function collectValues() {
//     // grab values from input field
//   }
//   function clearTheForm() {
//     // form.reset();
//   }
//
//   // only stores one function. useful when some operations feed data to the backend.
//   return {
//     add: add
//   };
// })();
// math.add(2, 3);
// math.add = 'Whoops'; // only overwrites the returned add property, not the add() function on math.
// math.add(2,3);
