(function($) {
    function BubbleSort() {
        this.numbers = null;
        this.indexOuter = 0;
        this.indexInner = 0;
        this.sortDone = false;
        this.change = false;
    }
    BubbleSort.prototype.setNumbers = function(numbers) {
        this.numbers = numbers;
        this.indexOuter = 0;
        this.indexInner = 0;
        this.change = false;
        this.sortDone = false;
    };
    BubbleSort.prototype.next = function() {
        this.change = false;
        if (this.numbers[this.indexInner] > this.numbers[this.indexInner + 1]) {
            this.change = true;
            var tmp = this.numbers[this.indexInner];
            this.numbers[this.indexInner] = this.numbers[this.indexInner + 1];
            this.numbers[this.indexInner + 1] = tmp;
        }
        this.indexInner++;
        if (this.indexInner == this.numbers.length - 1 - this.indexOuter) {
            this.indexInner = 0;
            this.indexOuter++;
        }
        if (this.indexOuter >= this.numbers.length - 1) {
            this.sortDone = true;
        }
    };
    BubbleSort.prototype.reset = function() {
        this.indexOuter = 0;
        this.indexInner = 0;
        this.sortDone = false;
        this.change = false;
    };

    function Generator(numbersCount, maxNumber) {
        this.numbersCount = numbersCount;
        this.maxNumber = maxNumber;
    }
    Generator.prototype.generate = function() {
        var numbers = [];
        for (var i = 0; i < this.numbersCount; i++) {
            numbers.push(Math.floor((Math.random() * this.maxNumber) + 1));
        }
        return numbers;
    };

    function Main() {
        this.numbersCount = 10;
        this.maxNumber = 30;
        this.init();
    }
    Main.prototype.init = function() {
        this.$el = $('#widget');
        this.$form = this.$el.find('form');
        this.$sortBlock = this.$el.find('#sort');
        this.renderForm();
        this.renderSortBlock();
        this.generator = new Generator(this.numbersCount, this.maxNumber);
        this.bubbleSort = new BubbleSort();
        this.$form.find('#ok').on('click', $.proxy(this.okHandler, this));
        this.$form.find('#generate').on('click', $.proxy(this.generateHandler, this));
        this.$sortBlock.find('#next').on('click', $.proxy(this.nextHandler, this));
        this.$sortBlock.find('#reset').on('click', $.proxy(this.resetHandler, this));

    };
    Main.prototype.renderForm = function() {
        for (var i = 0; i < this.numbersCount; i++) {
            this.$form.append(tmpl('form-element', {number: i}));
        }
        this.$form.append(tmpl('form-buttons'));
    };
    Main.prototype.renderSortBlock = function() {
        this.$sortBlock.append(tmpl('sort-outer'));
        for(var i = 0; i < this.numbersCount; i++) {
            this.$sortBlock.find('.btn-group').append(tmpl('sort-element', {index: i}));
        }
        this.$sortBlock.hide();
    };
    Main.prototype.okHandler = function() {
        var numbers = [];
        var self = this;
        this
            .$form
            .find('input')
            .each(function(i) {
                numbers.push(parseInt($(this).val()));
            })
            .promise()
            .done(function() {
                self.bubbleSort.setNumbers(numbers);
                self.initButtons(numbers);
                self.initHighight();
                self.$sortBlock.show();
            });
        this.$form.hide();
    };
    Main.prototype.generateHandler = function() {
        var numbers = this.generator.generate();
        this.$form.find('input').each(function(i) {
            $(this).val(numbers[i]);
        });
    };
    Main.prototype.initButtons = function(numbers) {
        for(var i = 0; i < numbers.length; i++) {
            $('#element-' + i).html(numbers[i]);
        }
    };
    Main.prototype.initHighight = function() {
        $('#element-0').addClass('btn-success');
        $('#element-1').addClass('btn-success');
    };
    Main.prototype.nextHandler = function(e) {
        if (this.bubbleSort.sortDone) {
            return;
        }
        this.bubbleSort.next();
        var self = this;
        if (this.bubbleSort.change) {
            $(e.target).attr('disabled', 'disabled');
            this
                .$sortBlock
                .find('.btn-success')
                .each(function() {
                    $(this).removeClass('btn-success');
                    $(this).addClass('btn-danger');
                })
                .promise()
                .done(function() {
                    self.refreshNumbers();
                    setTimeout(function() {
                        self.clearSelection();
                        self.setSelection();
                        $(e.target).removeAttr('disabled');
                    }, 1000);
                });
        } else {
            this.clearSelection();
            this.setSelection();
            this.refreshNumbers();
        }
    };
    Main.prototype.resetHandler = function() {
        this.bubbleSort.reset();
        this.clearSelection();
        this.$sortBlock.hide();
        this.$form.show();
    };
    Main.prototype.clearSelection = function() {
        for(var i = 0; i < this.numbersCount; i++) {
            $('#element-' + i).removeClass('btn-success');
            $('#element-' + i).removeClass('btn-danger');
        }
    };
    Main.prototype.setSelection = function() {
        $('#element-' + this.bubbleSort.indexInner).addClass('btn-success');
        $('#element-' + (this.bubbleSort.indexInner + 1)).addClass('btn-success');
    };
    Main.prototype.refreshNumbers = function() {
        for(var i = 0; i < this.numbersCount; i++) {
            $('#element-' + i).html(this.bubbleSort.numbers[i]);
        }
    };
    var main = new Main();
})(jQuery);



