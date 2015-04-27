/**
 * Round Controller
 *
 * @param {Object} $scope
 * @param {SocketClient} repository
 * @param {Notifier} notifier
 */
function RoundController($scope, repository, notifier)
{
    if (!$scope.game) { return; }

    this.$scope          = $scope;
    this.repository      = repository;
    this.notifier        = notifier;
    this.game            = this.$scope.game;
    this.warmupElement   = document.getElementById('warmup');
    this.tieBreakElement = document.getElementById('tie-break');
    this.countElement    = document.getElementById('count');
    this.endElement      = document.getElementById('end');
    this.warmupInterval  = null;

    // Binding
    this.onRoundNew  = this.onRoundNew.bind(this);
    this.onRoundEnd  = this.onRoundEnd.bind(this);
    this.onEnd       = this.onEnd.bind(this);
    this.onWarmup    = this.onWarmup.bind(this);
    this.endWarmup   = this.endWarmup.bind(this);
    this.applyScope  = this.applyScope.bind(this);
    this.digestScope = this.digestScope.bind(this);

    this.$scope.end         = false;
    this.$scope.roundWinner = null;
    this.$scope.gameWinner  = null;

    this.$scope.$on('$destroy', this.detachEvents);

    this.attachEvents();
}

/**
 * Attach socket Events
 */
RoundController.prototype.attachEvents = function()
{
    this.repository.on('round:end', this.onRoundEnd);
    this.repository.on('round:new', this.onRoundNew);
    this.repository.on('end', this.onEnd);
};

/**
 * Attach socket Events
 */
RoundController.prototype.detachEvents = function()
{
    this.repository.off('round:end', this.onRoundEnd);
    this.repository.off('round:new', this.onRoundNew);
    this.repository.off('end', this.onEnd);
    this.clearWarmup();
};

/**
 * On round new
 *
 * @param {Event} e
 */
RoundController.prototype.onRoundNew = function(e)
{
    this.endElement.style.display = 'none';

    if (this.game.isTieBreak()) {
        this.tieBreakElement.style.display = 'block';
    }

    this.displayWarmup(this.game.warmupTime);
    this.digestScope();
};

/**
 * On round end
 *
 * @param {Event} e
 */
RoundController.prototype.onRoundEnd = function(e)
{
    if (this.game.roundWinner) {
        this.notifier.notifyInactive(this.game.roundWinner.name + ' won round!');
        this.$scope.winner = this.game.avatars.getFirst();
        this.digestScope();
        this.endElement.style.display = 'block';
    }
};

/**
 * On end
 *
 * @param {Event} e
 */
RoundController.prototype.onEnd = function(e)
{
    this.notifier.notify('Game over!', null, 'win');
    this.$scope.winner = this.game.avatars.getFirst();
    this.digestScope();
    this.endElement.style.display = 'block';
};

/**
 * Start warmup
 */
RoundController.prototype.displayWarmup = function(time)
{
    this.warmupElement.style.display = 'block';
    this.countElement.innerHTML      = time/1000;
    this.warmupInterval              = setInterval(this.onWarmup, 1000);
    setTimeout(this.endWarmup, time);
    this.notifier.notify('Round start in ' + this.countElement.innerHTML + '...');
};

/**
 * On warmup
 */
RoundController.prototype.onWarmup = function()
{
    this.countElement.innerHTML--;
    this.notifier.notify('Round start in ' + this.countElement.innerHTML + '...');
};

/**
 * End warmup
 */
RoundController.prototype.endWarmup = function()
{
    this.clearWarmup();
    this.warmupElement.style.display = 'none';
    this.notifier.notify('Go!', 1000);
    this.digestScope();
};

/**
 * Clear warmup interval
 */
RoundController.prototype.clearWarmup = function()
{
    if (this.warmupInterval) {
        clearInterval(this.warmupInterval);
        this.warmupInterval = null;
    }
};

/**
 * Apply scope
 */
RoundController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
RoundController.prototype.digestScope = CurvytronController.prototype.digestScope;
