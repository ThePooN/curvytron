/**
 * BaseGame
 *
 * @param {Room} room
 */
function BaseGame(room)
{
    this.room     = room;
    this.name     = this.room.name;
    this.channel  = 'game:' + this.name;
    this.frame    = null;
    this.avatars  = this.room.players.map(function () { return new Avatar(this); });
    this.size     = this.getSize(this.avatars.count());
    this.rendered = false;

    this.start = this.start.bind(this);
    this.stop  = this.stop.bind(this);
    this.loop  = this.loop.bind(this);
}

BaseGame.prototype.framerate     = 1/60;
BaseGame.prototype.perPlayerSize = 100;

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step) {};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
BaseGame.prototype.removeAvatar = function(avatar)
{
    return this.avatars.remove(avatar);
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    if (!this.frame) {
        console.log("Game started!");
        this.rendered = new Date().getTime();
        this.loop();
    }
};

/**
 * Stop loop
 */
BaseGame.prototype.stop = function()
{
    if (this.frame) {
        clearTimeout(this.frame);
        this.frame    = null;
        this.rendered = null;
    }
};

/**
 * Animation loop
 */
BaseGame.prototype.loop = function()
{
    this.newFrame();

    var now = new Date().getTime(),
        step = now - this.rendered;

    this.rendered = now;

    this.onFrame(step);
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop.bind(this), this.framerate * 1000);
};

/**
 * On frame
 *
 * @param {Number} step
 */
BaseGame.prototype.onFrame = function(step)
{
    this.update(step);
};

/**
 * Get size by players
 *
 * @param {Number} players
 *
 * @return {Number}
 */
BaseGame.prototype.getSize = function(players)
{
    return Math.sqrt(players) * this.perPlayerSize;
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseGame.prototype.serialize = function()
{
    return {
        name: this.name,
        players: this.avatars.map(function () { return this.serialize(); }).items
    };
};

/**
 * Is started
 *
 * @return {Boolean}
 */
BaseGame.prototype.isStarted = function()
{
    return this.rendered !== null;
};
