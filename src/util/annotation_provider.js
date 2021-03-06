export class AnnotationProvider {
  annotation(clazz:Function, annotationType:Function) {
    var annotations = clazz.annotations || [];
    var res;
    annotations.forEach(function(annotation) {
      if (annotation instanceof annotationType) {
        res = annotation;
      }
    });
    return res;
  }
}
