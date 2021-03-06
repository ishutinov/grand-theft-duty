import ObjectPool from '../engine/ObjectPool';
import Bullet from './entities/Bullet';
import SAT from '../engine/collision/SAT';
import CollisionUtils from './CollisionUtils';

class BulletSystem {
    constructor (state, options = {}) {
        this.state = state;
        this.soldiers = this.state.soldiers;
        this.map = this.state.map;

        this.bulletPool = new ObjectPool(() => {
            const bullet = new Bullet(0, 0, 0, 4, 10);

            return bullet;
        }, 10, 10, options.poolLimit || 200);

        // Bullets that died last turn
        this.deadBullets = new Set();

        // Bullets currently flying around
        this.activeBullets = new Set();
    }

    get poolSize () {
        return this.bulletPool.size;
    }

    _fireBullet (firedBy) {
        let bullet = this.bulletPool.get();

        // If the pool is full, reused the first item.
        if (!bullet) {
            const firstBullet = this.activeBullets.values().next().value;

            this.bulletPool.free(firstBullet);
            bullet = this.bulletPool.get();
        }

        bullet.firedBy = firedBy;
        bullet.firedByWeapon = firedBy.currentWeapon;
        bullet.respawn(firedBy.position);
        bullet.angle = firedBy.angle;
        this.activeBullets.add(bullet);

        return bullet;
    }

    killBullet (bullet) {
        bullet.kill();
        this.bulletPool.free(bullet());
    }

    update (delta) {
        for (const soldier of this.soldiers) {
            if (soldier.actions.firedBullet) {
                this._fireBullet(soldier);
            }
        }

        for (const bullet of this.activeBullets) {
            bullet.update(delta);
            CollisionUtils.wallCollision(this.map, bullet, () => bullet.kill());

            if (bullet.dead) {
                this.deadBullets.add(bullet);
                this.activeBullets.delete(bullet);
                this.bulletPool.free(bullet);
            } else {
                for (const soldier of this.soldiers) {
                    if (!soldier.dead) {
                        // Can't kill itself
                        if (bullet.firedBy !== soldier) {
                            // Check if on same level
                            if ((bullet.position.z >= soldier.position.z) && (bullet.position.z < soldier.position.z + 50)) {
                                if (SAT.pointInPolygon(bullet.point, soldier.body)) {
                                    soldier.hitByBullet(bullet);
                                    bullet.kill();
                                    this.bulletPool.free(bullet);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export default BulletSystem;
