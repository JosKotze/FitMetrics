import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ActivityService } from '../../services/activity/activity.service';


export const mapResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  activityService: ActivityService
): Observable<any> => {
  const activityId = route.paramMap.get('activityId');
  const userId = route.paramMap.get('userId');

  if (!activityId || !userId) {
    return of(null); // Or handle error as you need
  }

  return activityService.getActivityMap(+activityId, +userId);
};
