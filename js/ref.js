const test = (function() {
    const ghostCreator = function() {
        const container = document.querySelector('.all-ghosts-container');
        const emptyContainer = document.querySelector('.empty-container');
        let allGhosts = [];
        const storage = {
            set() {
                localStorage.setItem('ghosts', JSON.stringify(allGhosts));
            },
            get() {
                let ghosts = localStorage.ghosts === undefined ?
                    false :
                    JSON.parse(localStorage.ghosts);
                return ghosts;
            },
            clear() {
                localStorage.removeItem('ghosts');
                console.log('localStorage cleared!');
            }
        };
        class Ghost {
            constructor(name, color, primary = 'float', secondary = 'float') {
                this.name = name;
                this.background = color;
                this.primary = primary;
                this.secondary = secondary;
                this.init();
            }

            addListeners() {
                this.regions.ghost.addEventListener('click', () => {
                    this.regions.ghost.classList.add(this.secondary);
                });
                this.regions.ghost.addEventListener('animationend', () => {
                    this.regions.ghost.classList.remove(this.primary, this.secondary);
                });
            }
            build() {
                const ghostContainer = document.createElement('div');
                const ghost = document.createElement('div');
                const info = document.createElement('p');

                ghostContainer.className = `ghost-container ${this.name.toLowerCase()}`;
                ghost.className = 'ghost';
                ghost.style.backgroundColor = this.background;
                info.textContent = this.name;

                ghostContainer.appendChild(ghost);
                ghostContainer.appendChild(info);
                container.appendChild(ghostContainer);

                return {
                    container: ghostContainer,
                    ghost: ghost,
                    info: info
                };
            }

            primaryAction() {
                this.regions.ghost.classList.add(this.primary);
            }


            init() {
                this.regions = this.build();
                this.addListeners();
                this.primaryAction();
            }
        }

        function buildFromStorage() {
            if (storage.get()) {
                const ghosts = storage.get();

                for (let index = 0; index < ghosts.length; index++) {
                    createGhostInstance(ghosts[index]);
                }
            }
        }

        function createGhostInstance(context) {
            allGhosts.push(context);
            console.log(allGhosts);
            storage.set();
            toggleEmptyContainer();
            return new Ghost(context.name, context.color, context.primary, context.secondary);
        }

        function toggleEmptyContainer() {
            if (allGhosts.length === 0) {
                emptyContainer.classList.remove('is-hidden');
            } else {
                emptyContainer.classList.add('is-hidden');
            }
        }

        return {
            build: createGhostInstance,
            buildFromStorage: buildFromStorage,
            storage: storage
        };
    };

    const form = document.querySelector('.create-form');
    let ghostsCreator = ghostCreator();

    function getFormValues(fields) {
        const valuesObj = {
            name: fields[0].value,
            color: fields[1].value,
            primary: fields[2].value,
            secondary: fields[3].value
        };
        return valuesObj;
    }

    form.addEventListener('submit', () => {
        event.preventDefault();

        const context = getFormValues(event.target);
        ghostsCreator.build(context);

        form.reset();
    });

    window.addEventListener('keyup', () => {
        if (event.keyCode === 67) {
            ghostsCreator.storage.clear();
        }
    });

    ghostsCreator.buildFromStorage();

    return {
        buildFromConsole: ghostsCreator.build
    };
})();
