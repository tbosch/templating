import {inject} from 'di/testing';
import {Injector} from 'di';
import {Compiler} from '../../src/compiler/compiler';
import {ViewFactory} from '../../src/view_factory';
import {NgIf} from './ng_if';
import {$, $html} from '../dom_mocks';

describe('ngIf', ()=>{
  var view, container, ngIf, anchor;

  function compile(html) {
    inject(Compiler, ViewFactory, (compiler, viewFactory) => {
      container = $('<div>'+html+'</div>')[0];
      var compiledTemplate = compiler.compileChildNodes(container, [NgIf]);

      view = viewFactory.createRootView({template: compiledTemplate});
      anchor = container.lastChild;
    });
  }

  it('should not show the content initially if the attribute value is falsy', ()=>{
    compile('<a ng-if=""></a>');
    expect(anchor.ngIf).toBeFalsy();
    expect($html(container.childNodes)).toBe('<!--template anchor-->')
  });

  it('should show the content initially if the attribute value is truthy', ()=>{
    compile('<a ng-if="true"></a>');
    view.digest();
    expect(anchor.ngNode.ngIf).toBe('true');
    expect($html(container.childNodes)).toBe('<a ng-if="true"></a><!--template anchor-->')
  });

  it('should show the content when the value is changed to true', ()=>{
    compile('<a ng-if=""></a>');
    anchor.ngNode.ngIf = true;
    view.digest();
    expect($html(container.childNodes)).toBe('<a ng-if=""></a><!--template anchor-->')
  });

  it('should hide the content when the value is changed to false', ()=>{
    compile('<a ng-if="true"></a>');
    anchor.ngNode.ngIf = false;
    expect($html(container.childNodes)).toBe('<!--template anchor-->')
  });

});
