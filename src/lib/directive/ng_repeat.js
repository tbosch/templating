import {TemplateDirective} from '../annotations';
import {Inject} from 'di';
import {BoundViewFactory, InitAttrs} from '../view_factory';
import {ViewPort} from '../view';

@TemplateDirective({
  selector: '[ng-repeat]',
  bind: {
    'ngRepeat': 'ngRepeat'
  },
  observe: {
    'ngRepeat[]': 'ngRepeatChanged'
  }
})
export class NgRepeat {
  @Inject(BoundViewFactory, ViewPort, 'executionContext')
  constructor(viewFactory, viewPort, parentExecutionContext) {
    this.viewFactory = viewFactory;
    this.parentExecutionContext = parentExecutionContext;
    this.viewPort = viewPort;
    this.views = [];
    this.ngRepeat = null;
  }
  ngRepeatChanged(changeRecord) {
    var self = this;
    if (changeRecord && changeRecord.additionsHead && !changeRecord.movesHead && !changeRecord.removalsHead) {
      var entry = changeRecord.additionsHead;
      while (entry) {
        addRow(entry.item);
        entry = entry.nextAddedRec;
      }
      return;
    }
    var rows;
    if (changeRecord) {
      rows = changeRecord.iterable;
    } else {
      rows = [];
    }
    // TODO: Update the views incrementally!
    this.views.forEach((view) => {
      view.remove();
    });
    this.views = [];
    rows.forEach(addRow);

    function addRow(row) {
      var context = Object.create(self.parentExecutionContext);
      context.row = row;
      var view = self.viewFactory.createView({executionContext: context});
      var lastView = self.views[self.views.length-1];
      if (lastView) {
        view.insertAfterView(lastView);
      } else {
        view.appendTo(self.viewPort);
      }
      self.views.push(view);
    }

  }
}
